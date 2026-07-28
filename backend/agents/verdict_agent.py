import json
from services.gemini_service import model


def generate_verdict(claim, evidence):

    evidence_text = ""

    for item in evidence:
        evidence_text += f"""
Title: {item.get('title')}

Content:
{item.get('content')}
"""

    prompt = f"""
YYou are CivicVerify AI.

Analyze the claim using the evidence.

Evaluate:

1. factual correctness
2. date consistency
3. amount consistency
4. source agreement
5. evidence quality

Return ONLY valid JSON.

Claim:
{claim}

Evidence:
{evidence_text}

Return ONLY valid JSON:

{{
    "verdict":"TRUE/FALSE/PARTIALLY TRUE/MISLEADING/UNVERIFIABLE",
    "confidence":0,
    "evidence_quality":0,
    "source_agreement":0,
    "reasoning":"brief explanation"
}}
"""

    try:
        response = model.generate_content(prompt)

        text = response.text.strip()

        text = text.replace("```json", "")
        text = text.replace("```", "")

        return json.loads(text)

    except Exception as e:

        return {
            "verdict": "UNVERIFIABLE",
            "confidence": 0,
            "evidence_quality": 0,
            "source_agreement": 0,
            "reasoning": str(e)
        }