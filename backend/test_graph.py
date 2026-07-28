from workflows.investigation_graph import (
    investigation_graph,
)

result = investigation_graph.invoke(
    {
        "claim":
            "Chennai Flood Mitigation Project received ₹500 crore in 2025",

        "evidence": [],

        "verdict": {},

        "confidence": 0,

        "evidence_quality": 0,

        "source_agreement": 0,

        "timeline": [],

        "rti": {},
    }
)

print(result)