// // app/code/[code]/page.js
// import { format } from 'date-fns';
// import { notFound } from 'next/navigation';

// export default async function StatsPage({ params }) {
//   const { code } = params;
//   const res = await fetch(`${process.env.BASE_URL}/api/links/${code}`, { cache: 'no-store' });
//   if (!res.ok) notFound();
//   const link = await res.json();
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
//   const shortUrl = `${baseUrl}/${code}`;

//   return (
//     <div className="max-w-md">
//       <h2 className="text-xl font-bold mb-4">Stats for {code}</h2>
//       <div className="space-y-2">
//         <p><strong>Short URL:</strong> <a href={shortUrl} className="text-blue-500 hover:underline">{shortUrl}</a></p>
//         <p><strong>Target URL:</strong> {link.targetUrl}</p>
//         <p><strong>Total Clicks:</strong> {link.clicks}</p>
//         <p><strong>Last Clicked:</strong> {link.lastClicked ? format(new Date(link.lastClicked), 'PPP p') : 'Never'}</p>
//       </div>
//       <a href="/" className="text-blue-500 mt-4 inline-block hover:underline">← Back to Dashboard</a>
//     </div>
//   );
// }


// app/[code]/route.js
import { NextResponse } from 'next/server';
import { connectDB} from '@/lib/mongoose';
import Link from '@/models/Link';


export async function GET(request, { params }) {
  try {
    await connectDB();
    const { code } = await params;

    if (!code || code.length < 3) {
      return new NextResponse('Invalid code', { status: 400 });
    }

    const link = await Link.findOne({ code: code.toUpperCase() });

    if (!link) {
      return NextResponse.next(); // Let Next.js show 404 page (or customize below)
      // OR return a nice 404:
      // return new NextResponse('Short link not found', { status: 404 });
    }

    // Update click stats
    link.clicks += 1;
    link.lastClicked = new Date();
    await link.save();

    return NextResponse.redirect(link.targetUrl);
  } catch (error) {
    console.error('Redirect error:', error);
    return new NextResponse('Server error', { status: 500 });
  }
}