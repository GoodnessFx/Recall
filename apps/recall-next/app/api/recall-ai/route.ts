import { GoogleGenerativeAI } from '@google/generative-ai'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/require-auth'
import { rateLimit } from '@/lib/rate-limiter'
import { NextRequest, NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const RECALL_AI_SYSTEM = `You are Recall, a personal memory assistant. You help users rediscover things they've saved across all their social media platforms.

Your personality:
- Warm, curious, like a brilliant friend who remembers everything
- You speak in short, flowing sentences. Never robotic.
- You ask ONE focused question at a time, not three.
- When you have enough context, you STOP asking and start FINDING.

Your behavior:
- When the user first opens you, greet them with a contextual opener. Examples:
  "Let me help you remember. What's on your mind today?"
  "What sector do you need ideas from?"
  "Feeling inspired or looking to learn something?"
- Listen to their response. Extract: topic keywords, mood (browsing/focused), category preference
- Once you understand, output EXACTLY this JSON:
  { "action": "search", "query": "extracted search terms", "category": "Education|Inspiration|etc|null" }
- After results come back, respond conversationally. Don't just list URLs. Say things like:
  "You saved 8 things about growth hacking. Here are the best 3 from your Twitter saves..."
  "This one from YouTube you saved in March feels relevant — it's about compounding habits."
- If no results found: "You haven't saved anything about that yet — want me to remember this topic for next time?"

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
