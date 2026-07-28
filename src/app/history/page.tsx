"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useRouter } from "next/navigation";

export default function HistoryPage() {

    const router = useRouter();

    const [investigations, setInvestigations] =
        useState<any[]>([]);

    useEffect(() => {

        fetch(
            "http://127.0.0.1:8000/investigations"
        )
            .then(
                (r) => r.json()
            )
            .then(
                setInvestigations
            );

    }, []);

    return (
        <DashboardLayout>

            <div className="space-y-6">

                <h1 className="text-3xl font-bold">
                    Investigation History
                </h1>

                {investigations.map(
                    (item) => (

                        <div
                            key={item.id}
                            className="
                                bg-white
                                border
                                rounded-xl
                                p-6
                                cursor-pointer
                                hover:shadow-lg
                            "
                            onClick={() => {

                                localStorage.setItem(
                                    "selectedInvestigation",
                                    String(item.id)
                                );

                                router.push(
                                    "/investigation"
                                );
                            }}
                        >

                            <h2 className="text-xl font-semibold">
                                {item.claim}
                            </h2>

                            <div className="mt-4 flex gap-6">

                                <span>
                                    Verdict:
                                    {" "}
                                    {item.verdict}
                                </span>

                                <span>
                                    Confidence:
                                    {" "}
                                    {item.confidence}%
                                </span>

                                <span>
                                    Evidence:
                                    {" "}
                                    {item.evidence_quality}%
                                </span>

                            </div>

                        </div>
                    )
                )}

            </div>

        </DashboardLayout>
    );
}