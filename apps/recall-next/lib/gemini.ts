import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

const SYSTEM_PROMPT = `You are a content librarian for a bookmark manager called Recall.

Given a URL, title, and description of a saved bookmark, output ONLY valid JSON with this exact structure:
{
  "category": "Education" | "Inspiration" | "Archive" | "Reference" | "Fun",
  "summary": "10 words max describing the content",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "video_ideas": ["idea1", "idea2"] // Optional: only if the content is a video or highly visual
}

Category rules:
- Education: teaches a skill, explains a concept, news, how-to, tutorials, coding, finance tips
- Inspiration: motivational, aesthetic, creative spark, art, design, travel, "day in the life"
- Reference: tools, docs, templates, resources to return to repeatedly
- Fun: memes, entertainment, sports, humor, movie trailers
- Archive: everything else, personal interest, "watch later"

Video Ideas rule:
- If the content is from TikTok, Instagram Reels, or YouTube, suggest 1-2 creative video ideas or content angles the user could take based on this save.

Output ONLY the JSON object. No markdown. No explanation. No backticks.`

export async function categorizeWithGemini(
  bookmarkId: string,
  title: string,
  description: string,
  url: string
): Promise<{ category: string; summary: string; keywords: string[]; video_ideas?: string[] }> {
  try {
    const prompt = `URL: ${url}\nTitle: ${title}\nDescription: ${description}`
    const result = await model.generateContent([SYSTEM_PROMPT, prompt])
    const response = await result.response
    const text = response.text().trim()
    
    // Clean potential markdown code blocks if AI ignores instructions
    const jsonStr = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()
    const parsed = JSON.parse(jsonStr)
    
    return {
      category: parsed.category || 'Archive',
      summary: parsed.summary || '',
      keywords: parsed.keywords || [],
      video_ideas: parsed.video_ideas || [],
    }
  } catch (error) {
    console.error('Gemini categorization failed:', error)
    return { category: 'Archive', summary: '', keywords: [] }
  }
}
