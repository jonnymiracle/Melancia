import { NextResponse } from "next/server";

const IG_USER_ID = process.env.INSTAGRAM_USER_ID;
const IG_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const GRAPH_VERSION = "v21.0";

export async function GET() {
  if (!IG_USER_ID || !IG_TOKEN) {
    return NextResponse.json(
      { error: "Instagram not configured", data: [] },
      { status: 500 }
    );
  }

  const fields = "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp";
  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${IG_USER_ID}/media?fields=${fields}&limit=12&access_token=${IG_TOKEN}`;

  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) {
    const err = await res.text();
    console.error("[insta/feed]", res.status, err);
    return NextResponse.json(
      { error: "Failed to fetch Instagram feed", data: [] },
      { status: 500 }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
