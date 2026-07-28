def detect_information_gaps(
    evidence
):

    gaps = []

    combined = ""

    for item in evidence:

        title = (
            item.get(
                "title"
            )
            or ""
        )

        content = (
            item.get(
                "content"
            )
            or ""
        )

        combined += (
            title
            + " "
            + content
        ).lower()

    checks = [
        "budget",
        "tender",
        "completion",
        "contractor",
        "audit",
    ]

    for check in checks:

        if check not in combined:

            gaps.append(
                check
            )

    return gaps