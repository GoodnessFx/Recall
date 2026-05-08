const requests = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(userId: string, limit = 20, windowMs = 60_000): boolean {
  const now = Date.now()
  const record = requests.get(userId)

  if (!record || now > record.resetAt) {
    requests.set(userId, { count: 1, resetAt: now + windowMs })
    return true // allowed
  }

  if (record.count >= limit) return false // blocked

  record.count++
  return true
}
