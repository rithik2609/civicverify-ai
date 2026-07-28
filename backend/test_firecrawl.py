from services.firecrawl_service import (
    extract_url
)

data = extract_url(
    "https://www.reuters.com/"
)

if data:

    print(data["title"])
    print()
    print(data["description"])
    print()
    print(data["content"][:500])

else:

    print(
        "Extraction failed"
    )