"use client"; 

import toast from "react-hot-toast"; 
import { useEffect, useState } from "react";
import { Link2, Loader2, Plus, Search } from "lucide-react";
import copy from "copy-to-clipboard";
import LinkRow from "@/components/LinkRow";

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
      toast.error("Failed to load links");
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
        const { code: newCode } = await res.json();
        const shortUrl = `${baseUrl}/${newCode}`;

        toast.success("Short link created!");
        copy(shortUrl); 
        toast.success("Short link copied to clipboard!", { duration: 2000 });

        setUrl("");
        setCode("");
        fetchLinks();
      } else {
        const { error } = await res.json();
        toast.error(error || "Failed to create link");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (code) => {
    if (!confirm("Delete this link?")) return;

    try {
      const res = await fetch(`/api/links?code=${code}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Link deleted");
        fetchLinks();
      } else {
        toast.error("Failed to delete link");
      }
    } catch (err) {
      toast.error("Network error");
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
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
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