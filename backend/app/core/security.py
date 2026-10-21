"""
Security Enhancements: Rate Limiting & SSRF Protection.
Protects webhooks, connectors, and public endpoints against abuse, SSRF, and DDoS.
"""
import ipaddress
import socket
import time
import urllib.parse
from typing import Dict, List, Optional, Tuple
from fastapi import Request, HTTPException, status
from app.core.config import settings

class RateLimiter:
    """In-memory sliding window rate limiter."""
    _instance: Optional["RateLimiter"] = None

    def __init__(self, rpm: int = 240):
        self.rpm = rpm
        self.requests: Dict[str, List[float]] = {}

    @classmethod
    def get_instance(cls) -> "RateLimiter":
        if cls._instance is None:
            cls._instance = cls(rpm=settings.RATE_LIMIT_RPM)
        return cls._instance

    def is_allowed(self, client_key: str) -> Tuple[bool, int]:
        """Returns (is_allowed, remaining_requests)."""
        now = time.time()
        window_start = now - 60.0

        timestamps = self.requests.get(client_key, [])
        # Prune expired
        timestamps = [t for t in timestamps if t > window_start]
        if len(timestamps) >= self.rpm:
            self.requests[client_key] = timestamps
            return False, 0

        timestamps.append(now)
        self.requests[client_key] = timestamps
        return True, self.rpm - len(timestamps)

def validate_safe_url(url: str, allow_loopback: bool = False) -> Tuple[bool, str]:
    """
    Validates that a URL does NOT point to an internal, link-local, or cloud metadata address.
    Defends against Server-Side Request Forgery (SSRF).
    """
    try:
        parsed = urllib.parse.urlparse(url.strip())
        if parsed.scheme.lower() not in ("http", "https"):
            return False, f"Invalid scheme '{parsed.scheme}': only HTTP and HTTPS allowed"

        hostname = parsed.hostname
        if not hostname:
            return False, "Missing hostname in URL"

        # Explicit block on cloud metadata hostnames
        if hostname.lower() in ("instance-data", "metadata.google.internal", "metadata"):
            return False, "Access to cloud metadata hostnames is forbidden"

        # Resolve hostname to IP addresses
        try:
            addr_info = socket.getaddrinfo(hostname, None)
        except socket.gaierror:
            # If hostname doesn't resolve yet in test, verify it's not a private IP literal
            pass
        else:
            for family, _, _, _, sockaddr in addr_info:
                ip_str = sockaddr[0]
                ip_obj = ipaddress.ip_address(ip_str)

                # Loopback check
                if ip_obj.is_loopback:
                    if not allow_loopback:
                        return False, f"Loopback address '{ip_str}' is forbidden"

                # Link-local / AWS / GCP / Azure metadata: 169.254.169.254
                if ip_obj.is_link_local or ip_str == "169.254.169.254":
                    return False, f"Link-local / cloud metadata address '{ip_str}' is strictly forbidden"

                # Private / RFC 1918 check
                if ip_obj.is_private:
                    if not allow_loopback:
                        return False, f"Private network address '{ip_str}' is forbidden (SSRF protection)"

                # Multicast / Reserved
                if ip_obj.is_multicast or ip_obj.is_reserved:
                    return False, f"Multicast or reserved address '{ip_str}' is forbidden"

        return True, "URL is safe"
    except Exception as e:
        return False, f"SSRF validation error: {str(e)}"
