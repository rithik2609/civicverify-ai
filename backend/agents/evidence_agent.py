def calculate_evidence_quality(evidence):

    if not evidence:
        return 0

    credibility = sum(
        item["credibility"]
        for item in evidence
    ) / len(evidence)

    source_count = min(
        len(evidence) * 20,
        100
    )

    diversity = len(
        set(
            item["url"].split("/")[2]
            for item in evidence
        )
    )

    diversity = min(
        diversity * 20,
        100
    )

    score = (
        credibility * 0.4 +
        source_count * 0.3 +
        diversity * 0.2 +
        90 * 0.1
    )

    return round(score)