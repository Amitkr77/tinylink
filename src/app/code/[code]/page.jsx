// app/code/[code]/page.jsx   ← File path must be exactly this

import { format } from 'date-fns';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/mongoose';
import Link from '@/models/Link';

// This forces fresh data every time (important!)
export const dynamic = 'force-dynamic';

async function StatsPage({ params }) {
  const { code } = await params;

  try {
    await connectDB();

    const link = await Link.findOne({ code: code.toUpperCase() });

    if (!link) {
      notFound();
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const shortUrl = `${baseUrl}/${link.code}`;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
              Stats for
              <code className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-mono text-lg">
                {link.code}
              </code>
            </h1>
          </div>

          <div className="space-y-6 text-gray-700">
            <div>
              <p className="text-sm font-medium text-gray-500">Short URL</p>
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline font-medium break-all"
              >
                {shortUrl}
              </a>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Destination</p>
              <p className="break-all">{link.targetUrl}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-indigo-600">{link.clicks}</p>
                <p className="text-sm text-gray-600">Total Clicks</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-lg font-medium text-gray-800">
                  {link.lastClicked
                    ? format(new Date(link.lastClicked), 'MMM d, yyyy')
                    : '—'}
                </p>
                <p className="text-sm text-gray-600">Last Clicked</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 text-center">
              <a
                href="/"
                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition"
              >
                ← Back to Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Stats page error:', error);
    notFound();
  }
}

// THIS LINE WAS MISSING — ADD IT!
export default StatsPage;