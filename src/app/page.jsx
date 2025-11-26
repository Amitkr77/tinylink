// app/page.jsx

"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link2, Loader2, Plus, Search, Sparkles, ExternalLink } from "lucide-react";
import copy from "copy-to-clipboard";
import LinkRow from "@/components/LinkRow";

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  // Epic entrance
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLinks();
      setInitialLoad(false);
    }, 1600);
    return () => clearTimeout(timer);
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await fetch("/api/links");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setLinks(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load links");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), code: code.trim() || undefined }),
      });

      const result = await res.json();

      if (res.ok) {
        const shortUrl = `${baseUrl}/${result.code}`;
        toast.success(
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5" />
            <div>
              <div className="font-semibold">Link created!</div>
              <div className="text-xs opacity-90">{shortUrl}</div>
            </div>
          </div>,
          { duration: 3000 }
        );
        copy(shortUrl);
        setUrl("");
        setCode("");
        fetchLinks();
      } else {
        toast.error(result.error || "Failed to create link");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (code) => {
    if (!confirm("Delete this link forever?")) return;
    try {
      const res = await fetch(`/api/links?code=${code}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Link deleted");
        fetchLinks();
      } else toast.error("Failed");
    } catch {
      toast.error("Network error");
    }
  };

  const filteredLinks = links.filter(
    (link) =>
      link.code.toLowerCase().includes(search.toLowerCase()) ||
      link.targetUrl.toLowerCase().includes(search.toLowerCase())
  );

  // GOD-TIER LOADING SCREEN
  if (initialLoad) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 bg-linear-to-r from-violet-600 to-indigo-600 blur-3xl animate-pulse"></div>
          <div className="relative z-10 text-center">
            <div className="mb-8">
              <Link2 className="w-24 h-24 text-white mx-auto animate-bounce" />
            </div>
            <h1 className="text-6xl font-black text-white tracking-tighter mb-4">
              Tiny<span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-indigo-400">Link</span>
            </h1>
            <p className="text-white/60 text-lg tracking-wide">Crafting your experience...</p>
            <div className="mt-10 flex justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-white/40 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-violet-50">
      <div className="max-w-7xl mx-auto px-6 py-20">

        {/* Hero Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-5 bg-white/70 backdrop-blur-2xl px-12 py-6 rounded-full shadow-2xl border border-white/50 mb-8">
            <div className="relative">
              <Link2 className="w-14 h-14 text-violet-600" />
              <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <h1 className="text-6xl font-black bg-linear-to-r from-violet-600 to-indigo-600 bg-clip-text text-text text-transparent">
              TinyLink
            </h1>
          </div>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Shorten links with style. Track clicks with precision. Own your data.
          </p>
        </div>

        {/* Create Form — Floating Masterpiece */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="bg-white/80 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/60 p-12 transform hover:scale-[1.005] transition-all duration-500">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              <div className="lg:col-span-6 relative group">
                <input
                  type="url"
                  placeholder="Enter the destination URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-4 py-3 text-xl rounded-2xl text-gray-800 border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all duration-300 bg-white/70 placeholder-gray-400 font-medium"
                  required
                />
                <ExternalLink className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-violet-600 transition-colors" />
              </div>

              <div className="lg:col-span-3">
                <input
                  type="text"
                  placeholder="Custom code (optional)"
                  value={code}
                  onChange={(e) => setCode(e.target.value.slice(0, 12).toUpperCase())}
                  className="w-full px-4 py-3 text-xl rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all bg-white/70 font-mono tracking-widest placeholder-gray-400 text-gray-800 "
                />
              </div>

              <div className="lg:col-span-3">
                <button
                  type="submit"
                  disabled={submitting || !url.trim()}
                  className="w-full px-4 py-3 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-violet-500/25 transition-all duration-300 flex items-center justify-center gap-4 disabled:cursor-not-allowed group"
                >
                  {submitting ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-500" />
                      <span>Create Magic</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="border p-4 rounded-4xl">
          {/* Search Bar */}
        <div className="w-full mb-16">
          <div className="relative group">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-800 group-focus-within:text-violet-600 transition-colors" />
            <input
              type="text"
              placeholder="Search your links..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-20 pr-10 py-7 text-xl bg-white/70 text-gray-800  rounded-3xl border-2 border-white/50 focus:border-violet-400 focus:ring-8 focus:ring-violet-100/50 transition-all duration-500 shadow-xl"
            />
          </div>
        </div>

        {/* Links List */}
        <div className="space-y-8">
          {loading ? (
            <div className="text-center py-32">
              <Loader2 className="w-16 h-16 text-violet-600 animate-spin mx-auto mb-6" />
              <p className="text-xl text-gray-500">Loading your beautiful links...</p>
            </div>
          ) : filteredLinks.length === 0 ? (
            <div className="text-center py-40">
              <div className="w-40 h-40 mx-auto bg-linear-to-br from-violet-100 to-indigo-100 rounded-full flex items-center justify-center mb-10">
                <Link2 className="w-20 h-20 text-violet-400" />
              </div>
              <h3 className="text-4xl font-bold text-gray-800 mb-4">No links yet</h3>
              <p className="text-xl text-gray-500">Create your first masterpiece above</p>
            </div>
          ) : (
            filteredLinks
              .sort((a, b) => b.clicks - a.clicks)
              .map((link) => (
                <LinkRow key={link.code} link={link} onDelete={handleDelete} baseUrl={baseUrl} />
              ))
          )}
        </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-32 pb-10">
          <p className="text-gray-500 text-sm">
            Made with <span className="text-red-500">Love</span> in India •{" "}
            <span className="font-bold text-violet-600">TinyLink</span> v1.0
          </p>
        </div>
      </div>
    </div>
  );
}