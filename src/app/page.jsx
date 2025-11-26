"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import copy from "copy-to-clipboard";
import {
  Link2,
  Plus,
  Search,
  Copy,
  BarChart3,
  Trash2,
  Globe,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

function LinkRow({ link, onDelete, baseUrl }) {
  const shortUrl = `${baseUrl}/${link.code}`;

  const copyShort = () => copy(shortUrl);
  const copyTarget = () => copy(link.targetUrl);

  return (
    <div className="group flex items-center justify-between py-5 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <code className="font-medium text-gray-900 text-sm tracking-tight">
            {link.code}
          </code>
          <button
            onClick={copyShort}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
          <Globe className="w-3.5 h-3.5" />
          <span className="truncate max-w-md">{link.targetUrl}</span>
          <button
            onClick={copyTarget}
            className="ml-1 text-gray-400 hover:text-gray-600"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-8 text-sm">
        <div className="text-center w-20">
          <div className="font-semibold text-gray-900">
            {link.clicks.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">clicks</div>
        </div>
        <div className="w-32 text-gray-600">
          {link.lastClicked
            ? format(new Date(link.lastClicked), "MMM d, yyyy")
            : "—"}
        </div>
        <div className="flex items-center gap-4">
          <a
            href={`/code/${link.code}`}
            className="text-gray-500 hover:text-gray-900 transition-colors"
            title="View stats"
          >
            <BarChart3 className="w-4 h-4" />
          </a>
          <button
            onClick={() => confirm("Delete this link?") && onDelete(link.code)}
            className="text-gray-400 hover:text-red-600 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await fetch("/api/links");
      const data = await res.json();
      setLinks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, code: code || undefined }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Short link created!" });
        setUrl("");
        setCode("");
        fetchLinks();
        setTimeout(() => setMessage(null), 3000);
      } else {
        const { error } = await res.json();
        setMessage({ type: "error", text: error || "Failed to create link" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error" });
    } finally {
      setSubmitting(false);
    }
  };

 const handleDelete = async (code) => {
    if (!confirm("Delete this link?")) return;

    try {
        const res = await fetch(`/api/links?code=${code}`, { method: "DELETE" });
        if (res.ok) {
            fetchLinks();
        } else {
            alert("Failed to delete");
        }
    } catch (err) {
        alert("Network error");
    }
};

  const filteredLinks = links?.filter(
    (link) =>
      link.code.toLowerCase().includes(search.toLowerCase()) ||
      link.targetUrl.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-cal font-semibold text-gray-900 flex items-center gap-3">
            <Link2 className="w-8 h-8 text-indigo-600" />
            Your Links
          </h1>
          <p className="mt-2 text-gray-600">
            Shorten, manage, and track your URLs
          </p>
        </div>

        {/* Create Form */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-10">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4"
          >
            <input
              type="url"
              placeholder="Enter a long URL..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 px-5 py-4 rounded-xl border border-gray-300 focus:outline-none focus:border-gray-400 transition text-gray-900 placeholder-gray-400"
              required
            />
            <input
              type="text"
              placeholder="Custom code (optional)"
              value={code}
              onChange={(e) => setCode(e.target.value.slice(0, 12))}
              className="w-full sm:w-48 px-5 py-4 rounded-xl border border-gray-300 focus:outline-none focus:border-gray-400 transition text-gray-900 placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={submitting || !url}
              className="px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 font-medium"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Shorten
                </>
              )}
            </button>
          </form>

          {message && (
            <div
              className={`mt-5 p-4 rounded-xl flex items-center gap-3 ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search links..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-14 pr-5 py-4 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-gray-400 transition text-gray-900 placeholder-gray-400"
          />
        </div>

        {/* Links List */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-16 text-center">
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin mx-auto" />
            </div>
          ) : filteredLinks.length === 0 ? (
            <div className="p-16 text-center">
              <Link2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl font-medium text-gray-600">No links yet</p>
              <p className="text-gray-500 mt-1">
                Create your first short link above
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredLinks
                .sort((a, b) => b.clicks - a.clicks)
                .map((link) => (
                  <LinkRow
                    key={link.code}
                    link={link}
                    onDelete={handleDelete}
                    baseUrl={baseUrl}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
