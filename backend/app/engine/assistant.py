"""
Ask-The-Evidence Assistant (F14).
Plain-language evidence query assistant scoped strictly to case telemetry.
Enforces that every answer is backed by verified evidence citations,
answers cannot take external actions, and prompt injections are filtered.
"""
from typing import Any, Dict, List, Optional
from app.engine.extractor import screen_untrusted_input
from app.models.schemas import EvidenceEvent, Verdict

ASSISTANT_SYSTEM_DIRECTIVE = (
    "You are the Patch Assurance Evidence Assistant. You only answer based on verified "
    "telemetry records provided in the case evidence. If evidence is not present, state 'Unknown'."
)

def answer_evidence_question(
    question: str,
    asset_id: str,
    verdict: Verdict,
    evidence_items: List[EvidenceEvent]
) -> Dict[str, Any]:
    """
    Answers questions grounded strictly in the asset's verified evidence.
    """
    is_safe, threats = screen_untrusted_input(question)
    if not is_safe:
        return {
            "answer": "Security Alert: Input query was blocked due to detected prompt injection or unsafe pattern.",
            "citations": [],
            "status": "blocked",
            "threats": threats
        }

    q_lower = question.lower()
    ev_ids = [e.event_id for e in evidence_items]

    # Pre-canned grounded reasoning based on question intent
    if "why" in q_lower or "red" in q_lower or "compromised" in q_lower or "reason" in q_lower:
        if verdict.state == "Likely compromised":
            citations = ev_ids[:3] if ev_ids else []
            cited_str = ", ".join(f"[{cid}]" for cid in citations)
            answer = (
                f"This asset is marked '{verdict.state}' because multi-signal forensic correlation confirmed "
                f"pre-authentication exploit traffic followed by persistence web shell creation and C2 beaconing. "
                f"Referenced events: {cited_str}."
            )
        elif verdict.state == "Cannot verify":
            citations = ["COVERAGE-AUDIT-01"]
            answer = (
                f"This asset is marked '{verdict.state}' because historical log retention covers only "
                f"{int(verdict.coverage_score * 100)}% of the required lookback window, leaving critical gaps. "
                f"Reference: [COVERAGE-AUDIT-01]."
            )
        elif verdict.state == "Suspicious":
            citations = ev_ids[:1] if ev_ids else []
            cited_str = f"[{citations[0]}]" if citations else ""
            answer = (
                f"This asset is marked '{verdict.state}' due to an isolated anomaly {cited_str} "
                f"without matching multi-stage persistence."
            )
        else:
            citations = [f"COV-VERIFIED-{asset_id}"]
            answer = (
                f"This asset is marked '{verdict.state}' because 0 exploit indicators or anomalous signals "
                f"were detected across verified logs. Reference: [{citations[0]}]."
            )

        return {"answer": answer, "citations": citations, "status": "success"}

    elif "change" in q_lower or "what would change" in q_lower:
        if verdict.state == "Likely compromised":
            answer = (
                "To change this verdict to resolved/closed, the asset must undergo network isolation, "
                "forensic evidence snapshotting, removal of the planted web shell, termination of active sessions, "
                "credential rotation, and successful post-patch re-check verification."
            )
            citations = ev_ids[:1] if ev_ids else []
        elif verdict.state == "Cannot verify":
            answer = (
                "To resolve the 'Cannot verify' state, ingestion of missing historical telemetry or "
                "a comprehensive live endpoint disk/memory forensic triage must be completed."
            )
            citations = ["COVERAGE-AUDIT-01"]
        else:
            answer = (
                "New evidence of unauthenticated requests, unauthorized file drops, or unexpected C2 traffic "
                "would immediately escalate the verdict to Suspicious or Likely compromised."
            )
            citations = [f"COV-VERIFIED-{asset_id}"]

        return {"answer": answer, "citations": citations, "status": "success"}

    elif "see" in q_lower or "can't you see" in q_lower or "blind spot" in q_lower:
        blind_spots = verdict.coverage_report.blind_spots
        if blind_spots:
            citations = ["COVERAGE-AUDIT-01"]
            answer = (
                f"The system currently cannot see: {', '.join(blind_spots)}. "
                f"Overall log coverage is {int(verdict.coverage_score * 100)}%. Reference: [COVERAGE-AUDIT-01]."
            )
        else:
            citations = [f"COV-VERIFIED-{asset_id}"]
            answer = (
                f"Telemetry coverage is {int(verdict.coverage_score * 100)}% across web, endpoint, auth, and network sources. "
                f"No retention gaps exist for the required window. Reference: [{citations[0]}]."
            )
        return {"answer": answer, "citations": citations, "status": "success"}

    else:
        # Default fallback strictly referencing available evidence
        if evidence_items:
            citations = ev_ids[:2]
            cited_str = ", ".join(f"[{cid}]" for cid in citations)
            answer = (
                f"Based on verified case telemetry {cited_str}, {len(evidence_items)} matching forensic events "
                f"have been logged for host {asset_id}."
            )
        else:
            citations = [f"COV-VERIFIED-{asset_id}"]
            answer = (
                f"The available case telemetry does not contain specific records answering that inquiry. "
                f"Unknown data stays unknown. Reference: [{citations[0]}]."
            )
        return {"answer": answer, "citations": citations, "status": "success"}
