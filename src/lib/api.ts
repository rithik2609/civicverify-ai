const API_URL = "http://localhost:8000";

export async function verifyClaim(claim: string) {
    try {
        console.log("Sending request...");

        const response = await fetch(
            `${API_URL}/verify`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    claim,
                }),
            }
        );

        console.log("Status:", response.status);

        const data = await response.json();

        console.log("Response:", data);

        return data;

    } catch (error) {
        console.error(
            "Fetch Error:",
            error
        );

        throw error;
    }
}