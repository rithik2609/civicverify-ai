import os

from dotenv import load_dotenv
from tavily import TavilyClient

from services.firecrawl_service import (
    extract_url,
)

load_dotenv()

API_KEY = os.getenv(
    "TAVILY_API_KEY"
)

if not API_KEY:
    raise Exception(
        "TAVILY_API_KEY missing"
    )

client = TavilyClient(
    api_key=API_KEY
)


def search_evidence(
    query: str
):

    response = client.search(
        query=query,
        search_depth="advanced",
        max_results=5,
    )

    results = []

    for item in response.get(
        "results", []
    ):

        url = item.get(
            "url"
        )

        print(
            f"Extracting: {url}"
        )

        extracted = (
            extract_url(
                url
            )
        )

        if extracted:

            results.append(
                {
                    "title":
                        extracted[
                            "title"
                        ],

                    "url":
                        url,

                    "content":
                        extracted[
                            "content"
                        ],

                    "description":
                        extracted[
                            "description"
                        ],

                    "source":
                        extracted[
                            "source"
                        ],
                }
            )

        else:

            # fallback to Tavily snippet
            results.append(
                {
                    "title":
                        item.get(
                            "title"
                        ),

                    "url":
                        url,

                    "content":
                        item.get(
                            "content"
                        ),

                    "description":
                        "",

                    "source":
                        url,
                }
            )

    return results