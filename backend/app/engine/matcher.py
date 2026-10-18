"""
Asset Inventory and Exposure Matching (F2).
Matches assets against advisory version ranges, surfaces unknown versions into 'needs_inventory',
and assigns exposure tiers (emergency, high, standard) feeding regulatory deadline clocks.
"""
import re
from typing import List, Tuple
from app.models.schemas import Advisory, Asset

def parse_semver(v_str: str) -> Tuple[int, ...]:
    """Extracts numeric version tuple from string (e.g., '9.1.4' -> (9, 1, 4))."""
    digits = [int(p) for p in re.findall(r"\d+", v_str)]
    return tuple(digits) if digits else (0,)

def is_version_vulnerable(asset_ver: str, affected_bounds: List[str]) -> Tuple[bool, bool]:
    """
    Evaluates whether an asset's version falls into affected version bounds.
    Returns: (is_vulnerable, is_unknown)
    """
    if not asset_ver or asset_ver.lower() in ["unknown", "n/a", "null", "?"]:
        return True, True  # Placed in needs_inventory

    asset_parts = parse_semver(asset_ver)
    if not asset_parts or asset_parts == (0,):
        return True, True

    # Check bounds like [">=9.0.0", "<=9.2.3"]
    vulnerable = True
    for bound in affected_bounds:
        bound = bound.strip()
        if bound.startswith(">="):
            b_parts = parse_semver(bound[2:])
            if asset_parts < b_parts:
                vulnerable = False
        elif bound.startswith("<="):
            b_parts = parse_semver(bound[2:])
            if asset_parts > b_parts:
                vulnerable = False
        elif bound.startswith(">"):
            b_parts = parse_semver(bound[1:])
            if asset_parts <= b_parts:
                vulnerable = False
        elif bound.startswith("<"):
            b_parts = parse_semver(bound[1:])
            if asset_parts >= b_parts:
                vulnerable = False
        elif bound.startswith("=="):
            b_parts = parse_semver(bound[2:])
            if asset_parts != b_parts:
                vulnerable = False

    return vulnerable, False

def calculate_exposure_tier(asset: Asset, advisory: Advisory) -> str:
    """
    Assigns regulatory exposure tier:
    - emergency: Internet-facing + critical asset affected by known exploited flaw (CERT-In 12h rule)
    - high: Internal critical asset or internet-facing high asset
    - standard: Other assets
    """
    if asset.status == "needs_inventory":
        return "emergency" if asset.internet_facing else "high"

    if asset.internet_facing and asset.criticality == "critical":
        return "emergency"
    elif asset.criticality in ["critical", "high"] or asset.internet_facing:
        return "high"
    return "standard"

def match_assets_to_advisory(assets: List[Asset], advisory: Advisory) -> List[Asset]:
    """
    Evaluates a fleet of assets against an advisory.
    Sets status ('matched', 'needs_inventory', 'unaffected') and exposure_tier.
    Never ignores or drops unknown versions.
    """
    updated_assets = []
    for asset in assets:
        # Check product name match
        prod_match = (
            advisory.product.lower() in asset.product.lower()
            or asset.product.lower() in advisory.product.lower()
        )

        if not prod_match:
            asset_copy = asset.model_copy(update={"status": "unaffected", "exposure_tier": "standard"})
            updated_assets.append(asset_copy)
            continue

        is_vuln, is_unknown = is_version_vulnerable(asset.version, advisory.affected_versions)

        if is_unknown:
            new_status = "needs_inventory"
        elif is_vuln:
            new_status = "matched"
        else:
            new_status = "unaffected"

        new_tier = calculate_exposure_tier(asset, advisory) if new_status != "unaffected" else "standard"
        updated = asset.model_copy(update={"status": new_status, "exposure_tier": new_tier})
        updated_assets.append(updated)

    return updated_assets
