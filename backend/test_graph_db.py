from services.neo4j_service import (
    save_investigation_graph
)

save_investigation_graph(
    "Chennai Flood Mitigation Project",

    [
        {
            "title":
                "Reuters",
            "url":
                "https://reuters.com",
            "credibility":
                95,
        },

        {
            "title":
                "PIB",
            "url":
                "https://pib.gov.in",
            "credibility":
                99,
        },
    ],
)

print(
    "Graph Saved"
)