import { sanitizeText } from './sanitizer'

export async function scrapeOG(url: string) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Recall/1.0)' },
      signal: AbortSignal.timeout(8000),
    })
    const html = await res.text()

    const getMeta = (prop: string) => {
      const match = html.match(new RegExp(`<meta[^>]*(?:property|name)=["']${prop}["'][^>]*content=["']([^"']+)["']`, 'i'))
        || html.match(new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*(?:property|name)=["']${prop}["']`, 'i'))
      return match?.[1] || ''
    }

    const getTitle = () => {
      const match = html.match(/<title[^>]*>([^<]+)<\/title>/i)
      return match?.[1]?.trim() || ''
    }

    return {
      title: sanitizeText(getMeta('og:title') || getTitle(), 200),
      description: sanitizeText(getMeta('og:description') || getMeta('description'), 400),
      image: getMeta('og:image'),
      siteName: sanitizeText(getMeta('og:site_name'), 100),
    }
  } catch (error) {
    console.error('OG Scraper failed:', error)
    return { title: url, description: '', image: '', siteName: '' }
  }
}
