// app/[code]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Link from "@/models/Link";

export const GET = async (request, { params }) => {
  try {
    const { code } = await params;

    if (!code || code.length < 3) {
      return new NextResponse("Invalid code", { status: 400 });
    }

    await connectDB();
    const link = await Link.findOne({ code: code.toUpperCase() });

    if (!link) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Update stats
    link.clicks += 1;
    link.lastClicked = new Date();
    await link.save();

    return NextResponse.redirect(link.targetUrl);
  } catch (error) {
    console.error("Redirect error:", error);
    return new NextResponse("Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";