"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  getAnalytics,
  getInvestigations,
} from "@/lib/dashboard";
import AnalyticsCharts from "@/components/dashboard/AnalyticsCharts";


export default function DashboardPage() {

  const [analytics, setAnalytics] =
    useState<any>(null);

  const [investigations, setInvestigations] =
    useState<any[]>([]);
  const [search, setSearch] =
    useState("");

    const [filter, setFilter] =
    useState("ALL");
  useEffect(() => {

    async function load() {

      const a =
        await getAnalytics();

      const i =
        await getInvestigations();

      setAnalytics(a);
      setInvestigations(i);

      
    }

    load();
      
  }, []);
const filtered =
    investigations.filter(
        (item) => {

            const matchSearch =
                item.claim
                    .toLowerCase()
                    .includes(
                        search
                            .toLowerCase()
                    );

            const matchFilter =
                filter === "ALL"
                    ? true
                    : item.verdict === filter;

            return (
                matchSearch &&
                matchFilter
            );
        }
    );
  return (
    <DashboardLayout>

      <div className="space-y-8">

        {/* Header */}

        <div>
          <h1 className="text-4xl font-bold">
            CivicVerify Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Investigation Analytics
          </p>
        </div>

        {/* Analytics */}

        <div className="grid md:grid-cols-4 gap-4">

          <div className="bg-white border rounded-xl p-6">
            <h3>Total</h3>

            <p className="text-4xl font-bold mt-2">
              {analytics?.total ?? 0}
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3>TRUE</h3>

            <p className="text-4xl font-bold mt-2">
              {analytics?.true ?? 0}
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3>FALSE</h3>

            <p className="text-4xl font-bold mt-2">
              {analytics?.false ?? 0}
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h3>PARTIAL</h3>

            <p className="text-4xl font-bold mt-2">
              {analytics?.partial ?? 0}
            </p>
          </div>
          <AnalyticsCharts
              analytics={analytics}
          />
          
        </div>

        {/* Investigations */}

        <div className="bg-white border rounded-xl p-6">
        <div className="flex gap-4 mb-6">

    <input
        value={search}
        onChange={(e) =>
            setSearch(
                e.target.value
            )
        }
        placeholder="Search claim..."
        className="
            border
            rounded-lg
            px-4
            py-2
            flex-1
        "
    />

    <select
        value={filter}
        onChange={(e) =>
            setFilter(
                e.target.value
            )
        }
        className="
            border
            rounded-lg
            px-4
        "
    >
        <option>
            ALL
        </option>

        <option>
            TRUE
        </option>

        <option>
            FALSE
        </option>

        <option>
            PARTIALLY TRUE
        </option>
        <option>
            MISLEADING
        </option>
    </select>

</div>
          <h2 className="text-2xl font-semibold mb-6">
            Recent Investigations
          </h2>

          <table className="w-full">

            <thead>
              <tr className="border-b">
                <th className="text-left py-3">
                  ID
                </th>

                <th className="text-left py-3">
                  Claim
                </th>

                <th className="text-left py-3">
                  Verdict
                </th>

                <th className="text-left py-3">
                  Confidence
                </th>
                <th className="text-left py-3">
                 Action
                </th>
              </tr>
            </thead>

            <tbody>

              {filtered.map(
                (item) => (
                  <tr
                    key={item.id}
                    className="border-b"
                  >

                    <td className="py-4">
                      {item.id}
                    </td>

                    <td>
                      {item.claim}
                    </td>

                    <td>
                      {item.verdict}
                    </td>

                    <td>
                      {item.confidence}%
                    </td>
                    <td>

                      <button
                          onClick={() => {

                              localStorage.setItem(
                                  "selectedInvestigation",
                                  item.id
                              );

                              window.location.href =
                                  "/history";
                          }}
                          className="
                              bg-black
                              text-white
                              px-3
                              py-2
                              rounded
                          "
                      >
                          Open
                      </button>

                  </td>
                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </DashboardLayout>
  );
}