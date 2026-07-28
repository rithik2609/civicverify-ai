"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ShieldCheck,
  FileText,
  ImageIcon,
  Link2,
} from "lucide-react";

import { verifyClaim } from "@/lib/api";

export default function Home() {
  const [claim, setClaim] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleInvestigation = async () => {
    if (!claim.trim()) {
      alert("Please enter a claim");
      return;
    }

    try {
      setLoading(true);

      const result = await verifyClaim(claim);

      localStorage.setItem(
        "investigation",
        JSON.stringify(result)
      );

      router.push("/investigation/1");
    } catch (error) {
      console.error(error);
      alert("Investigation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6">
            <ShieldCheck size={16} />
            <span>AI-Powered Public Verification</span>
          </div>

          <h1 className="text-6xl font-bold tracking-tight">
            Verify Any Claim Using Public Evidence
          </h1>

          <p className="text-xl text-gray-600 mt-6 max-w-3xl mx-auto">
            Analyze news articles, social media posts, PDFs,
            screenshots, government records and public datasets
            with AI.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <button className="px-6 py-3 rounded-lg bg-black text-white">
              Start Investigation
            </button>

            <button className="px-6 py-3 rounded-lg border">
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* Investigation Input */}
      <section className="px-6">
        <div className="max-w-4xl mx-auto border rounded-2xl p-6 shadow-sm">

          <input
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
            className="w-full border rounded-lg p-4 mb-4"
            placeholder="Paste a claim..."
          />

          <input
            className="w-full border rounded-lg p-4 mb-6"
            placeholder="Paste URL (Instagram, X, Facebook, News)"
          />

          <div className="grid md:grid-cols-3 gap-4">

            <button className="border rounded-lg p-4 flex items-center justify-center gap-2">
              <ImageIcon size={18} />
              Upload Image
            </button>

            <button className="border rounded-lg p-4 flex items-center justify-center gap-2">
              <FileText size={18} />
              Upload PDF
            </button>

            <button className="border rounded-lg p-4 flex items-center justify-center gap-2">
              <Link2 size={18} />
              Screenshot
            </button>

          </div>

          <button
            onClick={handleInvestigation}
            disabled={loading}
            className="w-full mt-6 bg-black text-white p-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Search size={18} />

            {loading
              ? "Investigating..."
              : "Investigate"}
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">

          <h2 className="text-4xl font-bold text-center mb-12">
            Powerful Investigation Features
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              "Claim Verification",
              "Source Credibility",
              "Knowledge Graph",
              "Timeline Reconstruction",
              "RTI Intelligence",
              "Export Reports",
            ].map((feature) => (
              <div
                key={feature}
                className="border rounded-xl p-6 hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-lg">
                  {feature}
                </h3>
              </div>
            ))}
          </div>

        </div>
      </section>
    </main>
  );
}