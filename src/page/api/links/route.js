// app/api/links/route.js
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import isUrl from 'is-url';
import crypto from 'crypto';
import { connectDB, Link } from '@/lib/mongoose';

const createSchema = z.object({
    url: z.string().refine(isUrl, 'Invalid URL'),
    code: z.string().optional().refine((val) => !val || /^[A-Za-z0-9]{6,8}$/.test(val), 'Code must be 6-8 alphanumeric'),
});

export async function POST(req) {
    await connectDB();
    try {
        const body = await req.json();
        const { url, code: customCode } = createSchema.parse(body);

        if (customCode) {
            const existing = await Link.findOne({ code: customCode });
            if (existing) return NextResponse.json({ error: 'Code exists' }, { status: 409 });
        }

        let newCode = customCode;
        if (!newCode) {
            do {
                newCode = crypto.randomBytes(4).toString('hex').toUpperCase().slice(0, 7);
            } while (await Link.findOne({ code: newCode }) || newCode.length < 6 || newCode.length > 8);
        }

        const link = await Link.create({ code: newCode, targetUrl: url });

        return NextResponse.json({ code: link.code, url: link.targetUrl });
    } catch (error) {
        if (error.name === 'ZodError') return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

export async function GET() {
    await connectDB();
    const links = await Link.find({}, { code: 1, targetUrl: 1, clicks: 1, lastClicked: 1 }).sort({ createdAt: -1 });
    return NextResponse.json(links);
}