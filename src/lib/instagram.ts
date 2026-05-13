export type InstaPost = {
  id: string
  caption?: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url: string
  thumbnail_url?: string
  permalink: string
  timestamp: string
}

const IG_USER_ID = process.env.INSTAGRAM_USER_ID
const IG_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN
const GRAPH_VERSION = 'v21.0'

export async function fetchInstagramFeed(limit = 6): Promise<InstaPost[]> {
  if (!IG_USER_ID || !IG_TOKEN) return []

  const fields = 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp'
  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${IG_USER_ID}/media?fields=${fields}&limit=${limit}&access_token=${IG_TOKEN}`

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    const json = await res.json()
    return (json.data ?? []) as InstaPost[]
  } catch {
    return []
  }
}
