"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ExportReport() {

    function exportPDF() {

        const data =
            JSON.parse(
                localStorage.getItem(
                    "investigation"
                ) || "{}"
            );

        const doc =
            new jsPDF();

        // Title
        doc.setFontSize(22);

        doc.text(
            "CivicVerify AI",
            20,
            20
        );

        doc.setFontSize(14);

        doc.text(
            "Investigation Report",
            20,
            30
        );

        // Claim
        doc.setFontSize(12);

        doc.text(
            "Claim:",
            20,
            45
        );

        doc.text(
            data.claim || "",
            20,
            52,
            {
                maxWidth: 170
            }
        );

        // Verdict
        doc.text(
            `Verdict: ${data.verdict}`,
            20,
            75
        );

        doc.text(
            `Confidence: ${data.confidence}%`,
            20,
            85
        );

        doc.text(
            `Evidence Quality: ${data.evidence_quality}%`,
            20,
            95
        );

        doc.text(
            `Source Agreement: ${data.source_agreement}%`,
            20,
            105
        );

        // Analysis
        doc.text(
            "Analysis",
            20,
            120
        );

        doc.text(
            data.analysis || "",
            20,
            128,
            {
                maxWidth: 170
            }
        );

        // Evidence Table
        autoTable(
            doc,
            {
                startY: 170,

                head: [
                    [
                        "Source",
                        "Credibility"
                    ]
                ],

                body:
                    data.evidence?.map(
                        (item: any) => [
                            item.title,
                            `${item.credibility}%`
                        ]
                    ) || [],
            }
        );

        // Timeline
        let y =
            (doc as any)
                .lastAutoTable
                .finalY + 20;

        doc.text(
            "Timeline",
            20,
            y
        );

        y += 10;

        data.timeline?.forEach(
            (item: any) => {

                doc.text(
                    `${item.date}: ${item.event}`,
                    20,
                    y,
                    {
                        maxWidth: 170
                    }
                );

                y += 10;
            }
        );

        // RTI
        y += 10;

        doc.text(
            "RTI Intelligence",
            20,
            y
        );

        y += 10;

        data.rti?.questions?.forEach(
            (
                q: string,
                i: number
            ) => {

                doc.text(
                    `${i + 1}. ${q}`,
                    20,
                    y,
                    {
                        maxWidth: 170
                    }
                );

                y += 10;
            }
        );

        doc.save(
            `INV-${Date.now()}.pdf`
        );
    }

    return (
        <button
            onClick={exportPDF}
            className="
                bg-black
                text-white
                px-5
                py-3
                rounded-lg
            "
        >
            Export PDF
        </button>
    );
}