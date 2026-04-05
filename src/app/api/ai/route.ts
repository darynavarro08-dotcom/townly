import { NextRequest, NextResponse } from 'next/server';

const GLM_API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";

const SYSTEM_PROMPT = `You are Townly AI, the intelligent assistant for community management.
You help HOA residents and board members with:
- Bylaw questions (cite specific sections)
- Dues and payment status
- Scheduling meetings and events
- Maintenance issue tracking
- Community governance

Always be specific, cite sources when relevant, and offer to take action.`;

export async function POST(req: NextRequest) {
  const { messages, communityContext } = await req.json();

  const response = await fetch(GLM_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GLM_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'glm-4-plus',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT + (communityContext ? `\n\nCommunity context:\n${communityContext}` : '') },
        ...messages
      ],
      temperature: 0.3,
      max_tokens: 1024,
      stream: false,
    }),
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content ?? 'Sorry, I could not process that.';
  return NextResponse.json({ reply });
}
