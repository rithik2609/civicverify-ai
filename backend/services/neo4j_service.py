import os
from dotenv import load_dotenv
from neo4j import GraphDatabase

load_dotenv()

NEO4J_URI = os.getenv("NEO4J_URI")
NEO4J_USER = os.getenv("NEO4J_USER")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD")

assert NEO4J_URI
assert NEO4J_USER
assert NEO4J_PASSWORD

driver = GraphDatabase.driver(
    NEO4J_URI,
    auth=(
        NEO4J_USER,
        NEO4J_PASSWORD,
    ),
)


def save_investigation_graph(
    claim: str,
    evidence: list,
):

    with driver.session() as session:

        session.run(
            """
            MERGE (c:Claim {
                text:$claim
            })
            """,
            claim=claim,
            
        )

        for item in evidence:

            title = (
                item.get("title")
                or "Unknown"
            )

            url = (
                item.get("url")
                or ""
            )

            credibility = (
                item.get(
                    "credibility",
                    0,
                )
            )

            session.run(
                """
                MERGE (e:Evidence {
                    title:$title
                })

                SET
                    e.url=$url,
                    e.credibility=$credibility

                WITH e

                MATCH (c:Claim {
                    text:$claim
                })

                MERGE
                    (c)-[:SUPPORTED_BY]->(e)
                """,
                claim=claim,
                title=title,
                url=url,
                credibility=credibility,
            )