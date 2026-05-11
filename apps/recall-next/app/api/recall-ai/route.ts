import { GoogleGenerativeAI } from '@google/generative-ai'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/require-auth'
import { rateLimit } from '@/lib/rate-limiter'
import { NextRequest, NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const RECALL_AI_SYSTEM = `You are Recall, a personal memory assistant. You help users rediscover things they've saved across all their social media platforms (X, Instagram, TikTok, etc.).

Your personality:
- Warm, curious, like a brilliant friend who remembers everything.
- You speak in short, flowing sentences. Never robotic.
- You ask ONE focused question at a time.
- When you have enough context, you STOP asking and start FINDING.

Your behavior:
- Help users find specific videos or saves they might have forgotten.
- If they ask for "video ideas" or "what to post", look at their recent saves and suggest creative angles.
- When presenting results, talk about the "vibes" or "content style" of their saves.
- Be proactive. If they seem stuck, suggest a category: "Want to see some of your Education saves from TikTok?"
- Use their platform preference: "I found a great Reels save from Instagram about that."

CRITICAL: When you have enough to search, output ONLY the JSON action object, nothing else.
When presenting results, speak naturally — never say "Here are the results" or "I found X items".`

export async function POST(request: NextRequest) {
  const { user, error: authError } = await requireAuth(request)
  if (authError) return authError

  if (!rateLimit(user!.id, 10, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const supabase = createSupabaseServerClient()
  const { messages, conversationId } = await request.json()

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  // Build conversation for Gemini
  const geminiMessages = [
    { role: 'user', parts: [{ text: RECALL_AI_SYSTEM }] },
    { role: 'model', parts: [{ text: 'Understood. I am Recall.' }] },
    ...messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    })),
  ]

  const chat = model.startChat({ history: geminiMessages.slice(0, -1) })
  const lastMessage = messages[messages.length - 1].content
  const result = await chat.sendMessage(lastMessage)
  const responseText = result.response.text().trim()

  // Check if AI wants to search
  let bookmarks = null
  let finalResponse = responseText

  try {
    // Clean potential markdown code blocks if AI ignores instructions
    const jsonStr = responseText.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()
    const parsed = JSON.parse(jsonStr)
    
    if (parsed.action === 'search') {
      // Perform actual search on user's bookmarks
      let dbQuery = supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user!.id)
        .textSearch('search_vector', parsed.query, { type: 'websearch' })
        .limit(8)
        .order('created_at', { ascending: false })

      if (parsed.category && parsed.category !== 'null') {
        dbQuery = dbQuery.eq('category', parsed.category)
      }

      const { data } = await dbQuery
      bookmarks = data || []

      // Now ask Gemini to formulate the conversational response
      const resultsContext = bookmarks.length > 0
        ? `Found ${bookmarks.length} bookmarks: ${bookmarks.map(b => `"${b.title}" (${b.platform}, ${b.category})`).join(', ')}`
        : 'No bookmarks found matching this search.'

      const summaryResult = await chat.sendMessage(
        `Search complete. ${resultsContext}. Now respond conversationally to the user as Recall.`
      )
      finalResponse = summaryResult.response.text()
    }
  } catch (e) {
    // Not JSON — it's a normal conversational message, use as-is
  }

  // Save conversation if conversationId is provided (optional enhancement)
  if (conversationId) {
    await supabase.from('recall_conversations').upsert({
      id: conversationId,
      user_id: user!.id,
      messages: [...messages, { role: 'ai', content: finalResponse }],
      bookmark_results: bookmarks,
    })
  }

  return NextResponse.json({
    message: finalResponse,
    bookmarks,
    conversationId,
  })
}
