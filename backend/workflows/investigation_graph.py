from typing import TypedDict

from langgraph.graph import (
    StateGraph,
    END,
)

from services.tavily_service import (
    search_evidence,
)
from services.neo4j_service import (
    save_investigation_graph,
)
from agents.credibility_agent import (
    calculate_credibility,
)

from agents.verdict_agent import (
    generate_verdict,
)

from agents.confidence_agent import (
    calculate_confidence,
)

from agents.evidence_agent import (
    calculate_evidence_quality,
)

from agents.agreement_agent import (
    calculate_source_agreement,
)

from agents.timeline_agent import (
    build_timeline,
)

from agents.rti_agent import (
    detect_information_gaps,
)

from agents.rti_draft_agent import (
    generate_rti_draft,
)


class InvestigationState(
    TypedDict
):

    claim: str

    evidence:   list

    verdict: dict

    confidence: int

    evidence_quality: int

    source_agreement: int

    timeline: list

    rti: dict


#################################################
# SEARCH AGENT
#################################################

def search_node(
    state: InvestigationState,
):

    evidence = search_evidence(
        state["claim"]
    )

    return {
        "evidence": evidence
    }


#################################################
# CREDIBILITY AGENT
#################################################

def credibility_node(
    state: InvestigationState,
):

    evidence = state[
        "evidence"
    ]

    for item in evidence:

        item[
            "credibility"
        ] = calculate_credibility(
            item["url"]
        )

    return {
        "evidence": evidence
    }

#################################################
# KNOWLEDGE GRAPH AGENT
#################################################

def graph_node(
    state: InvestigationState,
):

    save_investigation_graph(
        state["claim"],
        state["evidence"],
    )

    return state

#################################################
# VERDICT AGENT
#################################################

def verdict_node(
    state: InvestigationState,
):

    verdict = generate_verdict(
        state["claim"],
        state["evidence"],
    )

    return {
        "verdict": verdict
    }


#################################################
# CONFIDENCE AGENT
#################################################

def confidence_node(
    state: InvestigationState,
):

    confidence = (
        calculate_confidence(
            state["verdict"],
            state["evidence"],
        )
    )

    return {
        "confidence":
            confidence
    }


#################################################
# EVIDENCE AGENT
#################################################

def evidence_node(
    state: InvestigationState,
):

    quality = (
        calculate_evidence_quality(
            state["evidence"]
        )
    )

    return {
        "evidence_quality":
            quality
    }


#################################################
# AGREEMENT AGENT
#################################################

def agreement_node(
    state: InvestigationState,
):

    agreement = (
        calculate_source_agreement(
            state["evidence"]
        )
    )

    return {
        "source_agreement":
            agreement
    }


#################################################
# TIMELINE AGENT
#################################################

def timeline_node(
    state: InvestigationState,
):

    timeline = (
        build_timeline(
            state["claim"],
            state["evidence"],
        )
    )

    return {
        "timeline":
            timeline
    }


#################################################
# RTI AGENT
#################################################

def rti_node(
    state: InvestigationState,
):

    gaps = (
        detect_information_gaps(
            state["evidence"]
        )
    )

    rti = (
        generate_rti_draft(
            gaps
        )
    )

    return {
        "rti":
            rti
    }


#################################################
# BUILD GRAPH
#################################################

graph = StateGraph(
    InvestigationState
)

graph.add_node(
    "search",
    search_node,
)

graph.add_node(
    "credibility",
    credibility_node,
)

graph.add_node(
    "graph",
    graph_node,
)

graph.add_node(
    "verdict",
    verdict_node,
)

graph.add_node(
    "confidence",
    confidence_node,
)

graph.add_node(
    "evidence",
    evidence_node,
)

graph.add_node(
    "agreement",
    agreement_node,
)

graph.add_node(
    "timeline",
    timeline_node,
)

graph.add_node(
    "rti",
    rti_node,
)


#################################################
# FLOW
#################################################

graph.set_entry_point(
    "search"
)

graph.add_edge(
    "search",
    "credibility",
)

graph.add_edge(
    "credibility",
    "graph",
)

graph.add_edge(
    "graph",
    "verdict",
)

graph.add_edge(
    "verdict",
    "confidence",
)

graph.add_edge(
    "confidence",
    "evidence",
)

graph.add_edge(
    "evidence",
    "agreement",
)

graph.add_edge(
    "agreement",
    "timeline",
)

graph.add_edge(
    "timeline",
    "rti",
)

graph.add_edge(
    "rti",
    END,
)


investigation_graph = (
    graph.compile()
)