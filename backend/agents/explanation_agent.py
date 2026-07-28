def generate_explanation(
    verdict,
    confidence,
    evidence_quality,
    source_agreement,
):

    reasons = []

    if confidence < 50:
        reasons.append(
            "Low confidence score detected."
        )

    if evidence_quality < 70:
        reasons.append(
            "Evidence quality is limited."
        )

    if source_agreement < 50:
        reasons.append(
            "Sources show significant disagreement."
        )

    if verdict == "FALSE":
        reasons.append(
            "Evidence contradicts the original claim."
        )

    if verdict == "PARTIALLY TRUE":
        reasons.append(
            "Some evidence supports the claim while other evidence contradicts it."
        )

    if verdict == "TRUE":
        reasons.append(
            "Multiple sources support the claim."
        )

    return reasons