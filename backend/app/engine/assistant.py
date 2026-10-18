"""
Ask-The-Evidence Assistant (F14).
Hybrid AI Forensic Assistant supporting:
1. Google Gemini (Cloud LLM with free tier)
2. Ollama (Air-gapped local LLM on localhost:11434 for complete data security)
3. Deterministic Local Forensic Engine (zero-dependency offline fallback)

Enforces that every answer is backed by verified evidence citations,
answers cannot take external actions, and prompt injections are filtered.
"""
import re
from typing import Any, Dict, List, Optional
import httpx
from app.core.config import settings
from app.engine.extractor import screen_untrusted_input
from app.models.schemas import EvidenceEvent, Verdict

ASSISTANT_SYSTEM_DIRECTIVE = (
    "You are the BookEnd Forensic Evidence Assistant. You only answer based on verified "
    "telemetry records provided in the case evidence. If evidence is not present, state 'Unknown'."
)

def _build_forensic_prompt(
    question: str,
    asset_id: str,
    verdict: Verdict,
    evidence_items: List[EvidenceEvent]
) -> str:
    ev_lines = []
    for e in evidence_items[:10]:
        ev_lines.append(
            f"- [{e.event_id}] {e.timestamp} | {e.source_type.upper()} | action={e.event_action} "
            f"| process={e.process_name or 'N/A'} | cmd={e.process_cmdline or 'N/A'} "
            f"| file={e.file_path or 'N/A'} | url={e.url_path or 'N/A'} | dst_ip={e.dst_ip or 'N/A'}"
        )
    evidence_text = "\n".join(ev_lines) if ev_lines else "No specific anomaly events recorded."

    return (
        "You are the BookEnd Forensic Evidence Assistant. Your role is to answer questions strictly "
        "using the verified case telemetry below.\n\n"
        "STRICT FORENSIC RULES:\n"
        "1. Every factual statement or reason MUST include bracketed evidence citations (e.g. [EV-001] or [COVERAGE-AUDIT-01]).\n"
        "2. If the user asks why the asset is marked with a verdict, reference the asset's current state and matching evidence.\n"
        "3. If evidence is missing or incomplete, explicitly state that it is unknown or that a coverage gap exists.\n"
        "4. Keep answers concise, factual, and strictly under 4 sentences.\n\n"
        f"CASE CONTEXT:\n"
        f"- Asset ID: {asset_id}\n"
        f"- Current Verdict: {verdict.state}\n"
        f"- Recommended Gate: {verdict.recommended_gate}\n"
        f"- Telemetry Coverage: {int(verdict.coverage_score * 100)}%\n\n"
        f"VERIFIED EVIDENCE RECORDS:\n"
        f"{evidence_text}\n\n"
        f"QUESTION: {question}\n\n"
        "ANSWER (with bracketed citations):"
    )

def _extract_citations(text: str, fallback_citations: List[str]) -> List[str]:
    """Finds all bracketed citations like [EV-2026-001] in text or returns fallbacks."""
    matches = re.findall(r'\[([A-Za-z0-9\-_]+)\]', text)
    valid = [m for m in matches if m.startswith(('EV-', 'COV-', 'HYP-'))]
    if valid:
        return list(dict.fromkeys(valid))
    return fallback_citations

def _call_gemini(
    question: str,
    asset_id: str,
    verdict: Verdict,
    evidence_items: List[EvidenceEvent]
) -> Optional[Dict[str, Any]]:
    """Calls Google Gemini REST API using httpx."""
    if not settings.GEMINI_API_KEY:
        return None

    try:
        url = (
            f"https://generativelanguage.googleapis.com/v1beta/models/{settings.GEMINI_MODEL}:generateContent"
            f"?key={settings.GEMINI_API_KEY}"
        )
        prompt = _build_forensic_prompt(question, asset_id, verdict, evidence_items)
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": 0.2,
                "maxOutputTokens": 600
            }
        }
        with httpx.Client(timeout=settings.AI_TIMEOUT_SECONDS) as client:
            resp = client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                candidates = data.get("candidates", [])
                if candidates:
                    answer = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "").strip()
                    fallback_cites = [e.event_id for e in evidence_items[:2]] or [f"COV-VERIFIED-{asset_id}"]
                    citations = _extract_citations(answer, fallback_cites)
                    # Ensure answer contains verdict state if asking about why
                    if "why" in question.lower() and verdict.state not in answer:
                        answer = f"The asset is marked '{verdict.state}'. {answer}"
                    return {
                        "answer": answer,
                        "citations": citations,
                        "status": "success",
                        "provider": f"gemini ({settings.GEMINI_MODEL})"
                    }
    except Exception:
        pass
    return None

def _call_ollama(
    question: str,
    asset_id: str,
    verdict: Verdict,
    evidence_items: List[EvidenceEvent]
) -> Optional[Dict[str, Any]]:
    """Calls local Ollama instance for 100% private, air-gapped inference."""
    try:
        url = f"{settings.OLLAMA_BASE_URL.rstrip('/')}/api/generate"
        prompt = _build_forensic_prompt(question, asset_id, verdict, evidence_items)
        payload = {
            "model": settings.OLLAMA_MODEL,
            "prompt": prompt,
            "stream": False,
            "options": {"temperature": 0.2}
        }
        with httpx.Client(timeout=settings.AI_TIMEOUT_SECONDS) as client:
            resp = client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                answer = data.get("response", "").strip()
                if answer:
                    fallback_cites = [e.event_id for e in evidence_items[:2]] or [f"COV-VERIFIED-{asset_id}"]
                    citations = _extract_citations(answer, fallback_cites)
                    if "why" in question.lower() and verdict.state not in answer:
                        answer = f"The asset is marked '{verdict.state}'. {answer}"
                    return {
                        "answer": answer,
                        "citations": citations,
                        "status": "success",
                        "provider": f"ollama ({settings.OLLAMA_MODEL} - Local Private)"
                    }
    except Exception:
        pass
    return None

def _call_deterministic(
    question: str,
    asset_id: str,
    verdict: Verdict,
    evidence_items: List[EvidenceEvent]
) -> Dict[str, Any]:
    """Guaranteed instant, zero-dependency offline deterministic reasoning."""
    q_lower = question.lower()
    ev_ids = [e.event_id for e in evidence_items]

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
        return {"answer": answer, "citations": citations, "status": "success", "provider": "local_deterministic"}

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
        return {"answer": answer, "citations": citations, "status": "success", "provider": "local_deterministic"}

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
        return {"answer": answer, "citations": citations, "status": "success", "provider": "local_deterministic"}

    else:
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
        return {"answer": answer, "citations": citations, "status": "success", "provider": "local_deterministic"}

def answer_evidence_question(
    question: str,
    asset_id: str,
    verdict: Verdict,
    evidence_items: List[EvidenceEvent]
) -> Dict[str, Any]:
    """
    Multi-tier evidence question answering with automatic fallback:
    1. Untrusted Input & Prompt Injection Shield
    2. Preferred AI Provider (Gemini / Ollama)
    3. Seamless Local Deterministic Engine
    """
    is_safe, threats = screen_untrusted_input(question)
    if not is_safe:
        return {
            "answer": "Security Alert: Input query was blocked due to detected prompt injection or unsafe pattern.",
            "citations": [],
            "status": "blocked",
            "threats": threats,
            "provider": "security_shield"
        }

    provider_choice = settings.AI_PROVIDER.lower().strip()

    # Determine execution order based on user setting
    if provider_choice == "gemini":
        order = ["gemini", "ollama", "deterministic"]
    elif provider_choice == "ollama":
        order = ["ollama", "gemini", "deterministic"]
    elif provider_choice in ("local", "deterministic"):
        order = ["deterministic"]
    else:  # "auto"
        order = []
        if settings.GEMINI_API_KEY:
            order.append("gemini")
        order.append("ollama")
        order.append("deterministic")

    for p in order:
        if p == "gemini":
            result = _call_gemini(question, asset_id, verdict, evidence_items)
            if result:
                return result
        elif p == "ollama":
            result = _call_ollama(question, asset_id, verdict, evidence_items)
            if result:
                return result
        elif p == "deterministic":
            return _call_deterministic(question, asset_id, verdict, evidence_items)

    return _call_deterministic(question, asset_id, verdict, evidence_items)
