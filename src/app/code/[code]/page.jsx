import { format } from "date-fns";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongoose";
import Link from "@/models/Link";
import React from "react";
import {
  Copy,
  ExternalLink,
  ArrowLeft,
  Calendar,
  MousePointerClick,
} from "lucide-react";
export const dynamic = "force-dynamic";

async function StatsPage({ params }) {
  const { code } = await params;

  

  try {
    await connectDB();

    const link = await Link.findOne({ code: code.toUpperCase() });

    if (!link) {
      notFound();
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const shortUrl = `${baseUrl}/${link.code}`;

    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="w-full max-w-3xl">
          {/* Main Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
            {/* Header - linear Banner */}
            <div className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 p-10 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight">Link Analytics</h1>
                  <p className="text-white/80 mt-2 text-lg">Real-time performance for your short link</p>
                </div>
                <div className="text-right">
                  <code className="text-5xl font-bold tracking-wider bg-white/20 backdrop-blur px-6 py-3 rounded-2xl">
                    {link.code}
                  </code>
                </div>
              </div>
            </div>

            <div className="p-10 space-y-10">
              {/* Short URL Box */}
              <div className="group">
                <div className="flex items-center gap-3 mb-3">
                  <ExternalLink className="w-5 h-5 text-indigo-600" />
                  <p className="font-semibold text-gray-700">Your Short Link</p>
                </div>
                <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-5 border-2 border-dashed border-gray-300 group-hover:border-indigo-400 transition-all">
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-mono text-indigo-600 hover:text-indigo-800 truncate max-w-md"
                  >
                    {shortUrl}
                  </a>
                  {/* <button
                    // onClick={copyToClipboard}
                    className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition-all hover:scale-110 active:scale-95"
                    title="Copy short URL"
                  >
                    <Copy className="w-5 h-5" />
                  </button> */}
                </div>
              </div>

              {/* Destination URL */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">→</span>
                  </div>
                  <p className="font-semibold text-gray-700">Destination</p>
                </div>
                <p className="text-gray-600 bg-gray-50 rounded-xl p-4 font-medium break-all border border-gray-200">
                  {link.targetUrl}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Clicks */}
                <div className="bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white text-center transform hover:scale-105 transition-all duration-300">
                  <MousePointerClick className="w-12 h-12 mx-auto mb-4 opacity-90" />
                  <p className="text-5xl font-bold">{link.clicks.toLocaleString()}</p>
                  <p className="text-white/80 mt-2 text-lg">Total Clicks</p>
                </div>

                {/* Last Clicked */}
                <div className="bg-linear-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 text-white text-center transform hover:scale-105 transition-all duration-300">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-90" />
                  <p className="text-3xl font-bold">
                    {link.lastClicked ? format(new Date(link.lastClicked), "MMM d") : "—"}
                  </p>
                  <p className="text-white/80 mt-2">
                    {link.lastClicked ? format(new Date(link.lastClicked), "yyyy • h:mm a") : "No clicks yet"}
                  </p>
                  <p className="text-white/70 text-sm mt-1">Last Clicked</p>
                </div>

                {/* Created */}
                <div className="bg-linear-to-br from-orange-500 to-red-600 rounded-2xl p-8 text-white text-center transform hover:scale-105 transition-all duration-300">
                  <div className="w-12 h-12 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">Calendar</span>
                  </div>
                  <p className="text-3xl font-bold">{format(new Date(link.createdAt), "MMM d")}</p>
                  <p className="text-white/80 mt-2">{format(new Date(link.createdAt), "yyyy")}</p>
                  <p className="text-white/70 text-sm mt-1">Created On</p>
                </div>
              </div>

              {/* Back Button */}
              <div className="text-center pt-8 border-t border-gray-200">
                <a
                  href="/"
                  className="inline-flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white font-medium px-8 py-4 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Dashboard
                </a>
              </div>
            </div>
          </div>

          {/* Footer Badge */}
          <div className="text-center mt-8 text-gray-500 text-sm">
            Powered by <span className="font-bold text-indigo-600">TinyLink</span> • Built with love
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Stats page error:", error);
    notFound();
  }
}

export default StatsPage;
