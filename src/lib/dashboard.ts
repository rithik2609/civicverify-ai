const API =
  "http://localhost:8000";

export async function
getInvestigations() {

    const response =
      await fetch(
        `${API}/investigations`
      );

    return response.json();
}

export async function
getAnalytics() {

    const response =
      await fetch(
        `${API}/analytics`
      );

    return response.json();
}

export async function
getInvestigation(
    id: number
) {

    const response =
        await fetch(
            `${API}/investigations/${id}`
        );

    return response.json();
}