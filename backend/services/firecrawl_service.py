import os

from dotenv import load_dotenv
from firecrawl import FirecrawlApp
from typing import Optional
load_dotenv()

API_KEY = os.getenv(
    "FIRECRAWL_API_KEY"
)

if not API_KEY:
    raise Exception(
        "FIRECRAWL_API_KEY missing"
    )

app = FirecrawlApp(
    api_key=API_KEY
)


def extract_url(url: str)-> Optional[dict]:

    try:

        result = app.scrape_url(
            url,
            formats=["markdown"]
        )

        return {
            "url": url,

            "title":
                result.metadata.title
                if result.metadata
                else "",

            "description":
                result.metadata.description
                if result.metadata
                else "",

            "content":
                result.markdown[:5000]
                if result.markdown
                else "",

            "source":
                result.metadata.source_url
                if result.metadata
                else url,
        }

    except Exception as e:

        print(
            "Firecrawl Error:",
            e
        )

        return None