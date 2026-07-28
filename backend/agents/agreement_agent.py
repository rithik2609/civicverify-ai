def calculate_source_agreement(evidence):

    if not evidence:
        return 0

    trusted = 0

    for item in evidence:
        if item["credibility"] >= 85:
            trusted += 1

    agreement = (
        trusted /
        len(evidence)
    ) * 100

    return round(agreement)