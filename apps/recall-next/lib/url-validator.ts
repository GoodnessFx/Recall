const BLOCKED_PROTOCOLS = ['javascript:', 'data:', 'vbscript:', 'file:']
const BLOCKED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0', '::1', '169.254']

export function validateURL(rawUrl: string): { valid: boolean; url?: string; error?: string } {
  try {
    const url = new URL(rawUrl)

    // Block dangerous protocols
    if (BLOCKED_PROTOCOLS.some(p => url.protocol === p)) {
      return { valid: false, error: 'Invalid protocol' }
    }

    // Block internal network addresses
    if (BLOCKED_HOSTS.some(h => url.hostname.startsWith(h))) {
      return { valid: false, error: 'Private addresses not allowed' }
    }

    // Must be http or https
    if (!['http:', 'https:'].includes(url.protocol)) {
      return { valid: false, error: 'Only HTTP/HTTPS URLs allowed' }
    }

    return { valid: true, url: url.toString() }
  } catch {
    return { valid: false, error: 'Invalid URL format' }
  }
}
