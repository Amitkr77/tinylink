import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import Link from '@/models/Link';

export async function GET() {
    try {
        console.log('GET /api/links - Connecting to DB...');
        await connectDB();

        console.log('GET /api/links - Querying links...');
        const links = await Link.find({})
            .select('code targetUrl clicks lastClicked createdAt')
            .sort({ createdAt: -1 })
            .lean();

        console.log('GET /api/links - Found', links.length, 'links');
        return NextResponse.json(links);
    } catch (error) {
        console.error('GET /api/links ERROR:', error);
        return NextResponse.json(
            { error: 'Database error', details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();
        console.log('POST /api/links - Body:', body);

        const { url, code: customCode } = body;

        if (!url || typeof url !== 'string') {
            return NextResponse.json({ error: 'Valid URL is required' }, { status: 400 });
        }

        // Simple URL validation
        try { new URL(url); } catch {
            return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
        }

        let code = customCode?.trim().toUpperCase();

        if (code) {
            if (!/^[A-Z0-9]{6,12}$/.test(code)) {
                return NextResponse.json({ error: 'Custom code must be 6-12 alphanumeric characters' }, { status: 400 });
            }
            const exists = await Link.findOne({ code });
            if (exists) return NextResponse.json({ error: 'Code already taken' }, { status: 409 });
        } else {
            // Generate random code
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            while (true) {
                code = Array.from({ length: 7 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
                if (!await Link.findOne({ code })) break;
            }
        }

        const newLink = await Link.create({
            code,
            targetUrl: url,
            clicks: 0,
        });

        return NextResponse.json({ code: newLink.code, url: newLink.targetUrl });
    } catch (error) {
        console.error('POST /api/links ERROR:', error);
        return NextResponse.json(
            { error: 'Failed to create link', details: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');

        if (!code) return NextResponse.json({ error: 'Code required' }, { status: 400 });

        const result = await Link.deleteOne({ code });
        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Link not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE /api/links ERROR:', error);
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}