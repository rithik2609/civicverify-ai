def build_analytics(
    investigations
):

    analytics = {
        "TRUE": 0,
        "FALSE": 0,
        "PARTIALLY TRUE": 0,
        "MISLEADING": 0,
        "UNVERIFIABLE": 0,
    }

    for item in investigations:

        verdict = item.verdict

        if verdict in analytics:
            analytics[
                verdict
            ] += 1

    return analytics