import re
from datetime import datetime


def build_timeline(
    claim,
    evidence
):

    timeline = []

    timeline.append(
        {
            "date":
                datetime.now()
                .strftime(
                    "%d %b %Y"
                ),
            "event":
                "CivicVerify AI investigation executed",
        }
    )

    for item in evidence:

        content = item.get(
            "content",
            ""
        )

        years = re.findall(
            r"\b20\d{2}\b",
            content,
        )

        if years:

            for year in years[:2]:

                timeline.append(
                    {
                        "date":
                            year,
                        "event":
                            item.get(
                                "title"
                            ),
                    }
                )

        else:

            timeline.append(
                {
                    "date":
                        "Unknown",
                    "event":
                        item.get(
                            "title"
                        ),
                }
            )

    return timeline[:10]