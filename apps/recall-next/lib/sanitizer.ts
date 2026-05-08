import DOMPurify from 'isomorphic-dompurify'

export function sanitizeText(input: string, maxLength = 500): string {
  if (!input) return ''
  
  // Strip all HTML
  const stripped = DOMPurify.sanitize(input, { ALLOWED_TAGS: [] })
  
  // Trim and cap length
  return stripped.trim().slice(0, maxLength)
}
