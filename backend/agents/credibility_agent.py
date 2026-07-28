def calculate_credibility(url: str):

    url = url.lower()

    # Government
    if ".gov.in" in url:
        return 99

    if "pib.gov.in" in url:
        return 99

    # International News
    if "reuters.com" in url:
        return 95

    if "bbc.com" in url:
        return 94

    # Indian News
    if "thehindu.com" in url:
        return 92

    if "indianexpress.com" in url:
        return 90

    if "timesofindia.com" in url:
        return 85

    # Universities
    if ".edu" in url:
        return 88

    # Social Media
    if "twitter.com" in url:
        return 40

    if "x.com" in url:
        return 40

    if "instagram.com" in url:
        return 30

    if "facebook.com" in url:
        return 30

    # Unknown
    return 60