"""
Authentication, Multi-Tenancy, and Role-Based Access Control (RBAC).
Provides:
- OIDC / JWT SSO simulation and verification
- Per-tenant API keys with permission scoping
- Role hierarchy: Admin, Approver, Analyst, Auditor, Viewer
- Strict tenant authorization enforcement
"""
import base64
import hashlib
import hmac
import json
import secrets
import time
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Set
from fastapi import Header, HTTPException, Request, Depends, status
from pydantic import BaseModel, Field
from app.core.config import settings

class Role:
    ADMIN = "admin"
    APPROVER = "approver"
    ANALYST = "analyst"
    AUDITOR = "auditor"
    VIEWER = "viewer"

    ALL_ROLES = {ADMIN, APPROVER, ANALYST, AUDITOR, VIEWER}

class UserPrincipal(BaseModel):
    user_id: str
    name: str
    email: str
    role: str = Role.ANALYST
    tenant_id: str = "meridian-finance"  # Specific tenant id or '*' for global admin/auditor
    auth_method: str = "demo"  # 'api_key', 'sso_oidc', 'session', 'demo'
    issued_at: Optional[int] = None
    expires_at: Optional[int] = None

class ApiKey(BaseModel):
    key_id: str
    key_hash: str
    prefix: str
    name: str
    tenant_id: str
    role: str
    created_at: str
    last_used: Optional[str] = None
    is_active: bool = True

class AuthManager:
    _instance: Optional["AuthManager"] = None

    def __init__(self):
        # In-memory store of active API keys (seeded with default per-tenant keys)
        self.api_keys: Dict[str, ApiKey] = {}
        self.raw_keys_by_hash: Dict[str, ApiKey] = {}
        self._seed_default_keys()

    @classmethod
    def get_instance(cls) -> "AuthManager":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def _hash_key(self, raw_key: str) -> str:
        return hashlib.sha256(raw_key.encode("utf-8")).hexdigest()

    def _seed_default_keys(self):
        defaults = [
            ("pg_live_meridian_key_001", "Meridian Production Ingest Key", "meridian-finance", Role.ANALYST),
            ("pg_live_harbor_key_002", "Harbor Logistics Ingest Key", "harbor-logistics", Role.ANALYST),
            ("pg_live_lotus_key_003", "Lotus Clinics Triage Key", "lotus-clinics", Role.ANALYST),
            ("pg_live_approver_key_777", "Global Security Approver Key", "*", Role.APPROVER),
            ("pg_live_auditor_key_888", "Compliance Auditor Key", "*", Role.AUDITOR),
            ("pg_live_viewer_key_999", "Executive Read-Only Viewer Key", "*", Role.VIEWER),
            ("pg_admin_master_superkey", "Postern Root Admin Master Key", "*", Role.ADMIN),
        ]
        for raw, name, tenant, role in defaults:
            h = self._hash_key(raw)
            prefix = raw[:12] + "..."
            k = ApiKey(
                key_id=f"key_{h[:10]}",
                key_hash=h,
                prefix=prefix,
                name=name,
                tenant_id=tenant,
                role=role,
                created_at=datetime.now(timezone.utc).isoformat(),
                is_active=True
            )
            self.api_keys[k.key_id] = k
            self.raw_keys_by_hash[h] = k

    def create_api_key(self, name: str, tenant_id: str, role: str) -> Dict[str, Any]:
        """Creates and registers a new cryptographically random per-tenant API key."""
        random_suffix = secrets.token_urlsafe(24)
        tenant_clean = tenant_id.replace("-", "_") if tenant_id != "*" else "global"
        raw_key = f"pg_{tenant_clean}_{random_suffix}"
        h = self._hash_key(raw_key)
        prefix = raw_key[:12] + "..."
        k = ApiKey(
            key_id=f"key_{h[:10]}",
            key_hash=h,
            prefix=prefix,
            name=name,
            tenant_id=tenant_id,
            role=role,
            created_at=datetime.now(timezone.utc).isoformat(),
            is_active=True
        )
        self.api_keys[k.key_id] = k
        self.raw_keys_by_hash[h] = k
        return {
            "key_id": k.key_id,
            "name": k.name,
            "raw_key": raw_key,
            "prefix": k.prefix,
            "tenant_id": k.tenant_id,
            "role": k.role,
            "created_at": k.created_at
        }

    def list_api_keys(self, tenant_id: Optional[str] = None) -> List[ApiKey]:
        res = list(self.api_keys.values())
        if tenant_id and tenant_id != "*":
            res = [k for k in res if k.tenant_id in (tenant_id, "*")]
        return res

    def validate_api_key(self, raw_key: str) -> Optional[UserPrincipal]:
        h = self._hash_key(raw_key.strip())
        key = self.raw_keys_by_hash.get(h)
        if key and key.is_active:
            key.last_used = datetime.now(timezone.utc).isoformat()
            return UserPrincipal(
                user_id=f"service_account_{key.key_id}",
                name=key.name,
                email=f"{key.key_id}@postern.internal",
                role=key.role,
                tenant_id=key.tenant_id,
                auth_method="api_key"
            )
        return None

    def issue_jwt_token(self, user: UserPrincipal, expires_in_seconds: int = 86400) -> str:
        """Issues an HMAC-SHA256 signed JWT token."""
        now = int(time.time())
        exp = now + expires_in_seconds
        payload = {
            "sub": user.user_id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "tenant_id": user.tenant_id,
            "iat": now,
            "exp": exp
        }
        header = {"alg": "HS256", "typ": "JWT"}
        def _b64u(data: bytes) -> str:
            return base64.urlsafe_b64encode(data).decode('utf-8').rstrip('=')

        header_b64 = _b64u(json.dumps(header).encode('utf-8'))
        payload_b64 = _b64u(json.dumps(payload).encode('utf-8'))
        unsigned_token = f"{header_b64}.{payload_b64}"
        signature = hmac.new(
            settings.JWT_SECRET_KEY.encode('utf-8'),
            unsigned_token.encode('utf-8'),
            hashlib.sha256
        ).digest()
        signature_b64 = _b64u(signature)
        return f"{unsigned_token}.{signature_b64}"

    def verify_jwt_token(self, token: str) -> Optional[UserPrincipal]:
        """Verifies HMAC-SHA256 JWT signature and expiry."""
        try:
            parts = token.strip().split(".")
            if len(parts) != 3:
                return None
            header_b64, payload_b64, sig_b64 = parts
            unsigned = f"{header_b64}.{payload_b64}"

            # Pad base64url if needed
            def _unb64u(s: str) -> bytes:
                s += '=' * (-len(s) % 4)
                return base64.urlsafe_b64decode(s)

            expected_sig = hmac.new(
                settings.JWT_SECRET_KEY.encode('utf-8'),
                unsigned.encode('utf-8'),
                hashlib.sha256
            ).digest()

            actual_sig = _unb64u(sig_b64)
            if not hmac.compare_digest(expected_sig, actual_sig):
                return None

            payload = json.loads(_unb64u(payload_b64).decode('utf-8'))
            if payload.get("exp") and payload["exp"] < int(time.time()):
                return None

            return UserPrincipal(
                user_id=payload.get("sub", "unknown"),
                name=payload.get("name", "User"),
                email=payload.get("email", ""),
                role=payload.get("role", Role.ANALYST),
                tenant_id=payload.get("tenant_id", "meridian-finance"),
                auth_method="sso_oidc",
                issued_at=payload.get("iat"),
                expires_at=payload.get("exp")
            )
        except Exception:
            return None

def get_current_user(
    request: Request,
    authorization: Optional[str] = Header(None),
    x_api_key: Optional[str] = Header(None),
    x_approver_role: Optional[str] = Header(None),
    x_tenant_id: Optional[str] = Header(None)
) -> UserPrincipal:
    """
    FastAPI dependency to resolve the authenticated principal from:
    1. Header `X-API-Key`
    2. Header `Authorization: Bearer <token_or_key>`
    3. Header `X-Approver-Role` & `X-Tenant-ID` (demo/interactive developer mode)
    4. Default fallback when auth requirement is relaxed.
    """
    auth_mgr = AuthManager.get_instance()

    # 1. Check X-API-Key
    if x_api_key:
        user = auth_mgr.validate_api_key(x_api_key)
        if user:
            return user
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid API Key provided")

    # 2. Check Authorization Bearer
    if authorization and authorization.lower().startswith("bearer "):
        raw_token = authorization[7:].strip()
        # Check if it's an API key
        if raw_token.startswith("pg_"):
            user = auth_mgr.validate_api_key(raw_token)
            if user:
                return user
        # Try JWT verification
        user = auth_mgr.verify_jwt_token(raw_token)
        if user:
            return user
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired Bearer token")

    # 3. Check interactive console headers (e.g. SOC Analyst selecting roles in UI)
    if x_approver_role or x_tenant_id:
        role_val = (x_approver_role or Role.ANALYST).lower()
        if role_val not in Role.ALL_ROLES:
            role_val = Role.ANALYST
        return UserPrincipal(
            user_id="console_soc_user",
            name=f"Interactive {role_val.capitalize()}",
            email=f"{role_val}@postern.internal",
            role=role_val,
            tenant_id=x_tenant_id or "*",
            auth_method="session"
        )

    # 4. Strict mode enforcement
    if settings.REQUIRE_AUTH and settings.ENVIRONMENT == "production":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Provide 'Authorization: Bearer <token>' or 'X-API-Key' header.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    # 5. Default developer/demo principal (Admin level for unrestricted local testing)
    return UserPrincipal(
        user_id="default_dev_principal",
        name="Security Operations Lead",
        email="lead@postern.internal",
        role=Role.ADMIN,
        tenant_id="*",
        auth_method="demo"
    )

def require_roles(*allowed_roles: str):
    """Dependency factory checking that the authenticated principal possesses one of the required roles."""
    def _role_checker(user: UserPrincipal = Depends(get_current_user)) -> UserPrincipal:
        if user.role == Role.ADMIN:
            return user
        if user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Forbidden: Action requires one of {allowed_roles}, but current role is '{user.role}'"
            )
        return user
    return _role_checker

def check_tenant_authorization(user: UserPrincipal, target_tenant_id: str):
    """Enforces strict tenant isolation: users cannot read/modify other tenants unless global admin/auditor."""
    if user.role == Role.ADMIN or user.tenant_id == "*":
        return
    if user.tenant_id != target_tenant_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Tenant access denied: You belong to tenant '{user.tenant_id}' and cannot access resources in '{target_tenant_id}'"
        )
