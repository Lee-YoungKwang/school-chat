import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: '메시지 목록이 필요합니다.' },
        { status: 400 }
      );
    }

    // Read the user-provided environment variable CHATGPT_API (or OPENAI_API_KEY)
    const apiKey = process.env.CHATGPT_API || process.env.OPENAI_API_KEY;

    // Filter and sanitize recent conversation history (max 8 messages for context)
    const recentMessages = messages.slice(-8).map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: String(m.content || '').slice(0, 2000),
    }));

    const systemPrompt: Message = {
      role: 'system',
      content: `당신은 '학교 대화 사이트'의 친절하고 상냥한 AI 학교 생활 도우미 '빛솔이'입니다. 
주요 사용자층은 중학생과 교직원입니다.
- 학생에게는 다정하고 친근하며 격려와 응원이 담긴 따뜻한 한국어로 답변해 주세요.
- 교직원에게는 정중하고 신뢰감 있는 어조로 소통해 주세요.
- 학교 생활, 공부/수행평가 팁, 교우 관계, 학교 시설 이용, 고민 상담 등 궁금한 점에 대해 구체적이고 유익한 해결책을 제시해 주세요.
- 이모지(✨, 🎒, 🏫, 💡 등)를 자연스럽게 활용하여 읽기 쉽고 친근하게 답변하세요.
- 불건전하거나 위험한 내용에는 상냥하게 안전 지침을 안내해 주세요.`,
    };

    if (!apiKey) {
      // Helpful fallback response when API key is not yet synced in local development
      const lastUserMsg = recentMessages[recentMessages.length - 1]?.content || '';
      return NextResponse.json({
        reply: `🤖 안녕하세요! 저는 학교 대화 사이트 AI 도우미 '빛솔이'예요! ✨\n\n"${lastUserMsg}"에 대해 물어보셨군요!\n\n현재 로컬 개발 환경에서는 Vercel 환경변수(\`CHATGPT_API\`)가 연동 대기 중입니다. Vercel 배포 사이트에서는 등록해주신 ChatGPT API 키로 실시간 답변이 제공됩니다!\n\n💡 궁금한 점이나 학교 생활 관련 팁은 언제든 편하게 물어보세요!`,
      });
    }

    // Call OpenAI ChatGPT API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [systemPrompt, ...recentMessages],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', errData);
      
      const errMsg = errData.error?.message || 'OpenAI API 호출 중 오류가 발생했습니다.';
      return NextResponse.json(
        { 
          error: `ChatGPT API 오류: ${errMsg}`,
          reply: `⚠️ 죄송합니다! ChatGPT API 연결에 문제가 발생했습니다: ${errMsg}\nVercel Environment의 CHATGPT_API 키가 올바른지 확인해 주세요.`
        },
        { status: 200 }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || '답변을 생성하지 못했습니다.';

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: '서버 내부 오류가 발생했습니다.', reply: '죄송합니다. 챗봇 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 500 }
    );
  }
}
