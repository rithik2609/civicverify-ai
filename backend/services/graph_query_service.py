from services.neo4j_service import (
    driver,
)


def get_graph_data():

    nodes = []
    links = []

    with driver.session() as session:

        result = session.run(
            """
            MATCH (c:Claim)-[:SUPPORTED_BY]->(e:Evidence)
            RETURN c,e
            """
        )

        seen = set()

        for record in result:

            claim = record["c"]
            evidence = record["e"]

            claim_id = claim["text"]
            evidence_id = evidence["title"]

            if claim_id not in seen:
                nodes.append(
                    {
                        "id": claim_id,
                        "type": "claim",
                    }
                )
                seen.add(
                    claim_id
                )

            if evidence_id not in seen:
                nodes.append(
                    {
                        "id": evidence_id,
                        "type": "evidence",
                    }
                )
                seen.add(
                    evidence_id
                )

            links.append(
                {
                    "source":
                        claim_id,
                    "target":
                        evidence_id,
                }
            )

    return {
        "nodes": nodes,
        "links": links,
    }