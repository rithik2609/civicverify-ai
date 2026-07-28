
"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ExportReport from "@/components/investigation/ExportReport";
import KnowledgeGraph from "@/components/investigation/KnowledgeGraph";
export default function InvestigationPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("investigation");

    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  if (!data) {
    return (
      <DashboardLayout>
        <div className="p-10">
          Loading investigation...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div id="report-content" className="space-y-6">

        {/* Header */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between">

            <div>
              <h1 className="text-3xl font-bold">
                {data.claim}
              </h1>

              <p className="text-gray-500 mt-2">
                Investigation ID: INV-2026-001
              </p>
            </div>

            <div className="flex gap-3">
              <ExportReport />

              <button className="border px-4 py-2 rounded-lg hover:bg-gray-100">
                Share
              </button>
            </div>

          </div>
        </div>

        {/* Verdict */}
        <div className="grid md:grid-cols-4 gap-4">

          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <h3 className="text-green-700 font-semibold">
              Verdict
            </h3>

            <p className="text-3xl font-bold text-green-600 mt-2">
              {data.verdict}
            </p>
          </div>

          <div className="bg-white border rounded-xl p-5">
            <h3>Confidence</h3>

            <p className="text-3xl font-bold mt-2">
              {data.confidence}%
            </p>
          </div>

          <div className="bg-white border rounded-xl p-5">
            <h3>Evidence Quality</h3>

            <p className="text-3xl font-bold mt-2">
              {data.evidence_quality}%
            </p>
          </div>

          <div className="bg-white border rounded-xl p-5">
            <h3>Source Agreement</h3>

            <p className="text-3xl font-bold mt-2">
              {data.source_agreement}%
            </p>
          </div>

        </div>

        {/* Analysis */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Claim Analysis
          </h2>

          <pre className="whitespace-pre-wrap text-sm">
            {data.analysis || "No analysis available"}
          </pre>
        </div>

        <div className="bg-blue-50 border rounded-xl p-6">

    <h2 className="text-2xl font-semibold mb-4">
        Why this Verdict?
    </h2>

    <ul className="space-y-3">

        {data.explanation?.map(
            (
                item: string,
                index: number
            ) => (

                <li key={index}>
                    ✓ {item}
                </li>

            )
        )}

    </ul>

</div>

        {/* Evidence */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-2xl font-semibold mb-5">
            Evidence Sources
          </h2>

          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Source</th>
                <th className="text-left py-3">Type</th>
                <th className="text-left py-3">URL</th>
              </tr>
            </thead>

            <tbody>
              {data.evidence?.map(
                (item: any, index: number) => (
                  <tr
                    key={index}
                    className="border-b"
                  >
                    <td className="py-4">
                      {item.title}
                    </td>

                    <td>{item.credibility}%</td>

                    <td>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Open
                      </a>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
       <div className="bg-white rounded-xl border p-6">

  <h2 className="text-2xl font-semibold mb-5">
    Timeline Reconstruction
  </h2>

  <div className="space-y-5">

    {data.timeline?.map(
      (
        item: any,
        index: number
      ) => (
        <div key={index}>

          <strong>
            {item.date}
          </strong>

          <p className="text-gray-600">
            {item.event}
          </p>

        </div>
      )
    )}

  </div>

</div>
<div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">

  <h2 className="text-2xl font-semibold">
    RTI Intelligence
  </h2>

  <div className="mt-5">

    <h3 className="font-semibold">
      Missing Information
    </h3>

    <ul className="mt-2 space-y-2">
      {data.rti?.missing?.length > 0 ? (
        data.rti.missing.map(
          (item: string, index: number) => (
            <li key={index}>
              ❌ {item}
            </li>
          )
        )
      ) : (
        <li>
          No missing information detected
        </li>
      )}
    </ul>

    <h3 className="font-semibold mt-6">
      Suggested RTI Questions
    </h3>

    <ul className="mt-2 space-y-2">
      {data.rti?.questions?.map(
        (
          item: string,
          index: number
        ) => (
          <li key={index}>
            {index + 1}. {item}
          </li>
        )
      )}
    </ul>

    <button className="mt-6 bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800">
      Generate RTI Draft
    </button>

  </div>

</div>
<div className="bg-white rounded-xl border p-6">

    <h2 className="text-2xl font-semibold mb-5">
        Knowledge Graph
    </h2>

    <KnowledgeGraph />

</div>
      </div>
    </DashboardLayout>
  );
}