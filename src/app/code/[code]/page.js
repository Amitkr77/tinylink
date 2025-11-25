// app/code/[code]/page.js
import { format } from 'date-fns';
import { notFound } from 'next/navigation';

export default async function StatsPage({ params }) {
  const { code } = params;
  const res = await fetch(`${process.env.BASE_URL}/api/links/${code}`, { cache: 'no-store' });
  if (!res.ok) notFound();
  const link = await res.json();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const shortUrl = `${baseUrl}/${code}`;

  return (
    <div className="max-w-md">
      <h2 className="text-xl font-bold mb-4">Stats for {code}</h2>
      <div className="space-y-2">
        <p><strong>Short URL:</strong> <a href={shortUrl} className="text-blue-500 hover:underline">{shortUrl}</a></p>
        <p><strong>Target URL:</strong> {link.targetUrl}</p>
        <p><strong>Total Clicks:</strong> {link.clicks}</p>
        <p><strong>Last Clicked:</strong> {link.lastClicked ? format(new Date(link.lastClicked), 'PPP p') : 'Never'}</p>
      </div>
      <a href="/" className="text-blue-500 mt-4 inline-block hover:underline">← Back to Dashboard</a>
    </div>
  );
}