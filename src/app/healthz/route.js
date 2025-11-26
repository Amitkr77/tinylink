// app/api/healthz/route.js   

import { NextResponse } from "next/server";

export const GET = () => {
  return NextResponse.json(
    {
      ok: true,
      version: "1.0",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "application/json",
      },
    }
  );
};

export const dynamic = "force-dynamic";
