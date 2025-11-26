import toast from "react-hot-toast";
import copy from "copy-to-clipboard";
import { format } from "date-fns";
import { Copy, BarChart3, Trash2, Globe } from "lucide-react";

function LinkRow({ link, onDelete, baseUrl }) {
  const shortUrl = `${baseUrl}/${link.code}`;

  const copyShort = () => {
    copy(shortUrl);
    toast.success("Short link copied!");
  };

  const copyTarget = () => {
    copy(link.targetUrl);
    toast.success("Target URL copied!");
  };

  return (
    <div className="group flex items-center justify-between py-5 px-6 border-b border-gray-100 last:border-0 hover:bg-gray-50/70 transition-all duration-200">
      {/* Left: Code + Target URL */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <code className="font-semibold text-gray-900 text-base tracking-tight font-mono">
            {link.code}
          </code>
          <button
            onClick={copyShort}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-indigo-600"
            title="Copy short link"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
          <Globe className="w-3.5 h-3.5 text-gray-400" />
          <span className="truncate max-w-lg">{link.targetUrl}</span>
          <button
            onClick={copyTarget}
            className="text-gray-400 hover:text-indigo-600 transition-colors"
            title="Copy target URL"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right: Stats + Actions */}
      <div className="flex items-center gap-10 text-sm">
        {/* Clicks */}
        <div className="text-center min-w-20">
          <div className="font-bold text-gray-900 text-lg">
            {link.clicks.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">clicks</div>
        </div>

        {/* Last Clicked */}
        <div className="w-36 text-gray-600">
          {link.lastClicked ? (
            <span className="text-sm">
              {format(new Date(link.lastClicked), "MMM d, yyyy")}
            </span>
          ) : (
            <span className="text-gray-400">—</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Stats Page */}
          <a
            href={`/code/${link.code}`}
            className="text-gray-500 hover:text-indigo-600 transition-colors"
            title="View detailed stats"
          >
            <BarChart3 className="w-4.5 h-4.5" />
          </a>

          {/* Delete */}
          <button
            onClick={() => onDelete(link.code)}
            className="text-gray-400 hover:text-red-600 transition-colors"
            title="Delete link"
          >
            <Trash2 className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default LinkRow;