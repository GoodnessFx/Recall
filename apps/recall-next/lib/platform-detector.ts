const PLATFORMS: Record<string, string> = {
  'twitter.com': 'twitter',
  'x.com': 'twitter',
  'instagram.com': 'instagram',
  'tiktok.com': 'tiktok',
  'youtube.com': 'youtube',
  'youtu.be': 'youtube',
  'linkedin.com': 'linkedin',
  'reddit.com': 'reddit',
  'threads.net': 'threads',
  'pinterest.com': 'pinterest',
}

export function detectPlatform(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace('www.', '')
    for (const [domain, platform] of Object.entries(PLATFORMS)) {
      if (hostname.includes(domain)) return platform
    }
    return 'other'
  } catch {
    return 'other'
  }
}
