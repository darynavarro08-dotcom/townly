import { getGLMAgent } from '@/lib/glm';
import { getCurrentUser } from '@/utils/getCurrentUser';
import { buildSystemPrompt } from '@/utils/assistant/systemPrompt';
import { getTools } from '@/utils/assistant/tools';
import { executeTool } from '@/utils/assistant/executeTools';
import { getPlanAccess } from '@/utils/planAccess';

export async function POST(request: Request) {
  try {
    const glmAgent = getGLMAgent();

    const user = await getCurrentUser();
    if (!user) return new Response('Unauthorized', { status: 401 });

    const access = await getPlanAccess();
    if (!access || !access.canUseAI) {
      return new Response('AI feature requires an upgraded plan.', { status: 403 });
    }

    const { messages } = await request.json();

    const systemPrompt = await buildSystemPrompt(user);
    const tools = getTools(access);

    const response = await glmAgent.generateResponse([
      { role: 'system', content: systemPrompt },
      ...messages
    ], 'glm-5.1', 2000, 0.7);

    return Response.json({ message: response, toolResult: null });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Assistant Error:', msg);
    return new Response(
      JSON.stringify({ message: `Error communicating with Assistant. Details: ${msg}` }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
