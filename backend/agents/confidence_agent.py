def calculate_confidence(
    verdict_data,
    evidence
):

    base = verdict_data.get(
        "confidence",
        0
    )

    evidence_count = min(
        len(evidence) * 5,
        20
    )

    confidence = (
        base * 0.8
        + evidence_count
    )

    return min(
        round(confidence),
        100
    )