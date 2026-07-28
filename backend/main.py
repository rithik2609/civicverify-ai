from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import desc

from workflows.investigation_graph import (
    investigation_graph,
)

from models.schemas import VerifyRequest
from models.investigation import Investigation

from database.deps import get_db

from services.graph_query_service import (
    get_graph_data,
)

from agents.explanation_agent import (
    generate_explanation,
)

app = FastAPI(
    title="CivicVerify AI",
    version="1.0.0",
)


#################################################
# CORS
#################################################

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


#################################################
# HOME
#################################################

@app.get("/")
def home():

    return {
        "message":
            "CivicVerify AI Backend Running"
    }


#################################################
# HEALTH
#################################################

@app.get("/health")
def health():

    return {
        "status": "healthy",
        "service": "CivicVerify AI",
    }


#################################################
# VERIFY
#################################################

@app.post("/verify")
def verify(
    request: VerifyRequest,
    db: Session = Depends(get_db),
):

    result = investigation_graph.invoke(
        {
            "claim": request.claim,
            "evidence": [],
            "verdict": {},
            "confidence": 0,
            "evidence_quality": 0,
            "source_agreement": 0,
            "timeline": [],
            "rti": {},
        }
    )

    verdict = result.get(
        "verdict",
        {},
    )

    explanation = generate_explanation(
        verdict.get("verdict"),
        result.get(
            "confidence",
            0,
        ),
        result.get(
            "evidence_quality",
            0,
        ),
        result.get(
            "source_agreement",
            0,
        ),
    )

    investigation = Investigation(
        claim=request.claim,
        verdict=verdict.get(
            "verdict"
        ),
        confidence=result.get(
            "confidence",
            0,
        ),
        analysis=verdict.get(
            "reasoning",
            "",
        ),
        evidence_quality=result.get(
            "evidence_quality",
            0,
        ),
        source_agreement=result.get(
            "source_agreement",
            0,
        ),
    )

    db.add(investigation)
    db.commit()
    db.refresh(investigation)

    return {

        "id":
            investigation.id,

        "claim":
            request.claim,

        "verdict":
            verdict.get(
                "verdict"
            ),

        "confidence":
            result.get(
                "confidence",
                0,
            ),

        "analysis":
            verdict.get(
                "reasoning",
                "",
            ),

        "evidence_quality":
            result.get(
                "evidence_quality",
                0,
            ),

        "source_agreement":
            result.get(
                "source_agreement",
                0,
            ),

        "timeline":
            result.get(
                "timeline",
                [],
            ),

        "rti":
            result.get(
                "rti",
                {},
            ),

        "evidence":
            result.get(
                "evidence",
                [],
            ),

        "explanation":
            explanation,
    }


#################################################
# HISTORY
#################################################

@app.get("/investigations")
def get_investigations(
    db: Session = Depends(get_db),
):

    investigations = (
        db.query(
            Investigation
        )
        .order_by(
            desc(
                Investigation.id
            )
        )
        .all()
    )

    return [

        {
            "id":
                i.id,

            "claim":
                i.claim,

            "verdict":
                i.verdict,

            "confidence":
                i.confidence,

            "evidence_quality":
                i.evidence_quality,

            "source_agreement":
                i.source_agreement,
        }

        for i in investigations
    ]


#################################################
# SINGLE INVESTIGATION
#################################################

@app.get(
    "/investigations/{investigation_id}"
)
def get_investigation(
    investigation_id: int,
    db: Session = Depends(get_db),
):

    investigation = (
        db.query(
            Investigation
        )
        .filter(
            Investigation.id
            == investigation_id
        )
        .first()
    )

    if not investigation:

        return {
            "error":
                "Not found"
        }

    return {

        "id":
            investigation.id,

        "claim":
            investigation.claim,

        "verdict":
            investigation.verdict,

        "confidence":
            investigation.confidence,

        "analysis":
            investigation.analysis,

        "evidence_quality":
            investigation.evidence_quality,

        "source_agreement":
            investigation.source_agreement,

        "timeline": [],

        "rti": {},

        "evidence": [],

        "explanation":
            generate_explanation(
                investigation.verdict,
                investigation.confidence,
                investigation.evidence_quality,
                investigation.source_agreement,
            ),
    }


#################################################
# ANALYTICS
#################################################

@app.get("/analytics")
def analytics(
    db: Session = Depends(get_db),
):

    investigations = (
        db.query(
            Investigation
        ).all()
    )

    total = len(
        investigations
    )

    true_count = len([
        i for i in investigations
        if i.verdict == "TRUE"
    ])

    false_count = len([
        i for i in investigations
        if i.verdict == "FALSE"
    ])

    partial_count = len([
        i for i in investigations
        if i.verdict == "PARTIALLY TRUE"
    ])

    misleading_count = len([
        i for i in investigations
        if i.verdict == "MISLEADING"
    ])

    avg_confidence = 0
    avg_evidence = 0
    avg_agreement = 0

    if total > 0:

        avg_confidence = int(
            sum(
                i.confidence
                for i in investigations
            ) / total
        )

        avg_evidence = int(
            sum(
                i.evidence_quality
                for i in investigations
            ) / total
        )

        avg_agreement = int(
            sum(
                i.source_agreement
                for i in investigations
            ) / total
        )

    return {

        "total":
            total,

        "true":
            true_count,

        "false":
            false_count,

        "partial":
            partial_count,

        "misleading":
            misleading_count,

        "avg_confidence":
            avg_confidence,

        "avg_evidence":
            avg_evidence,

        "avg_agreement":
            avg_agreement,
    }


#################################################
# DASHBOARD
#################################################

@app.get("/dashboard")
def dashboard(
    db: Session = Depends(get_db),
):

    latest = (
        db.query(
            Investigation
        )
        .order_by(
            desc(
                Investigation.id
            )
        )
        .limit(5)
        .all()
    )

    return {

        "analytics":
            analytics(db),

        "recent": [

            {
                "id":
                    i.id,

                "claim":
                    i.claim,

                "verdict":
                    i.verdict,
            }

            for i in latest
        ]
    }


#################################################
# KNOWLEDGE GRAPH
#################################################

@app.get("/graph")
def graph():

    return get_graph_data()


@app.get("/graph/stats")
def graph_stats():

    graph = get_graph_data()

    return {

        "nodes":
            len(
                graph.get(
                    "nodes",
                    []
                )
            ),

        "edges":
            len(
                graph.get(
                    "links",
                    []
                )
            ),
    }