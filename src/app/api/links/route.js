// app/api/links/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Link from "@/models/Link";

// PROFESSIONAL SHORT CODE SETTINGS
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 7;
const MAX_GENERATION_ATTEMPTS = 50;

// Generate clean, readable, professional code
function generateProfessionalCode() {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return code;
}

// Generate unique code safely (no infinite loop)
async function generateUniqueCode() {
  for (let i = 0; i < MAX_GENERATION_ATTEMPTS; i++) {
    const code = generateProfessionalCode();
    if (!(await Link.findOne({ code }))) {
      return code;
    }
  }
  throw new Error("Failed to generate unique code after many attempts");
}

export async function GET() {
  try {
    await connectDB();
    const links = await Link.find({})
      .select("code targetUrl clicks lastClicked createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(links);
  } catch (error) {
    console.error("GET /api/links ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch links" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { url, code: customCode } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Valid URL is required" }, { status: 400 });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    let code = customCode?.trim().toUpperCase();

    if (code) {
      // Custom code validation
      if (!/^[A-Z0-9]{6,12}$/.test(code)) {
        return NextResponse.json(
          { error: "Custom code must be 6–12 uppercase letters/numbers only" },
          { status: 400 }
        );
      }
      const exists = await Link.findOne({ code });
      if (exists) {
        return NextResponse.json(
          { error: "This code is already taken" },
          { status: 409 }
        );
      }
    } else {
      // Generate beautiful, professional random code
      code = await generateUniqueCode();
    }

    const newLink = await Link.create({
      code,
      targetUrl: url.trim(),
      clicks: 0,
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const shortUrl = `${baseUrl}/${newLink.code}`;

    return NextResponse.json(
      {
        success: true,
        message: "Short link created!",
        code: newLink.code,
        shortUrl,
        targetUrl: newLink.targetUrl,
        clicks: 0,
        createdAt: newLink.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/links ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create link", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    const result = await Link.deleteOne({ code });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Link deleted" });
  } catch (error) {
    console.error("DELETE /api/links ERROR:", error);
    return NextResponse.json(
      { error: "Delete failed", details: error.message },
      { status: 500 }
    );
  }
}