import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const targetUrl = searchParams.get("url");

    if (!targetUrl) {
      return new NextResponse("Missing 'url' query parameter", { status: 400 });
    }

    const res = await fetch(targetUrl);

    if (!res.ok) {
      return new NextResponse("Failed to fetch the resource", { status: res.status });
    }

    const contentType = res.headers.get("Content-Type") || "application/octet-stream";
    const blob = await res.blob();

    return new Response(blob, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Proxy fetch error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
