// GLM 5.1 Integration for Townly
interface GLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GLMResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class GLMAgent {
  private apiKey: string;
  private baseURL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateResponse(
    messages: GLMMessage[],
    model: string = 'glm-5.1',
    maxTokens: number = 2000,
    temperature: number = 0.7
  ): Promise<string> {
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: maxTokens,
          temperature,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`GLM API Error: ${errorData.error?.message || response.statusText}`);
      }

      const data: GLMResponse = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('GLM API Error:', error);
      throw error;
    }
  }

  // Autonomous reasoning for community management
  async analyzeCommunityState(
    communityData: {
      members: any[];
      votes: any[];
      dues: any[];
      events: any[];
      issues: any[];
    }
  ): Promise<{
    issues: Array<{
      type: string;
      severity: 'low' | 'medium' | 'high';
      description: string;
      recommendedActions: string[];
    }>;
    insights: string[];
    priorities: string[];
  }> {
    const systemPrompt = `You are Townly, an autonomous community management AI powered by GLM 5.1.
    
    Your role is to analyze community data and:
    1. Identify issues that need attention
    2. Prioritize actions based on impact
    3. Generate actionable insights
    4. Plan multi-step solutions
    
    Analyze the provided community data and return a structured JSON response with:
    - issues: Array of problems with type, severity, description, and recommendedActions
    - insights: Key observations about community health
    - priorities: Ranked list of most important actions to take
    
    Focus on: engagement, financial health, governance, and operational efficiency.`;

    const userPrompt = `Analyze this community data and return JSON only:
    
    Members: ${JSON.stringify(communityData.members.slice(0, 5))} 
    Votes: ${JSON.stringify(communityData.votes.slice(0, 3))} 
    Dues: ${JSON.stringify(communityData.dues.slice(0, 3))} 
    Events: ${JSON.stringify(communityData.events.slice(0, 3))} 
    Issues: ${JSON.stringify(communityData.issues.slice(0, 3))}`;

    const messages: GLMMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const response = await this.generateResponse(messages, 'glm-5.1', 3000, 0.3);
    
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse GLM response:', response);
      return {
        issues: [],
        insights: ['Unable to analyze community data due to API limitations'],
        priorities: ['Check API connection and try again']
      };
    }
  }

  // Execute multi-step workflows
  async executeWorkflow(
    workflowType: 'engagement-recovery' | 'dues-collection' | 'conflict-resolution' | 'event-planning',
    context: any
  ): Promise<{
    steps: Array<{
      action: string;
      status: 'pending' | 'in-progress' | 'completed';
      result?: string;
    }>;
    summary: string;
  }> {
    const workflows = {
      'engagement-recovery': {
        systemPrompt: 'You are Townly executing an engagement recovery workflow. Create a multi-step plan to re-engage community members who haven not participated recently.',
        steps: ['Identify inactive members', 'Generate personalized messages', 'Schedule reminders', 'Create engagement incentives']
      },
      'dues-collection': {
        systemPrompt: 'You are Townly executing a dues collection workflow. Create a multi-step plan to collect overdue payments while maintaining positive community relationships.',
        steps: ['Identify overdue accounts', 'Generate payment reminders', 'Offer payment plans', 'Send final notices']
      },
      'conflict-resolution': {
        systemPrompt: 'You are Townly executing a conflict resolution workflow. Create a multi-step plan to mediate community disputes fairly and transparently.',
        steps: ['Analyze conflict details', 'Research relevant bylaws', 'Propose solutions', 'Facilitate communication']
      },
      'event-planning': {
        systemPrompt: 'You are Townly executing an event planning workflow. Create a multi-step plan to organize successful community events.',
        steps: ['Define event requirements', 'Schedule venue and time', 'Coordinate vendors', 'Manage RSVPs']
      }
    };

    const workflow = workflows[workflowType];
    const userPrompt = `Execute ${workflowType} workflow with context: ${JSON.stringify(context)}`;
    
    const messages: GLMMessage[] = [
      { role: 'system', content: workflow.systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const response = await this.generateResponse(messages, 'glm-5.1', 2000, 0.5);
    
    return {
      steps: workflow.steps.map(step => ({
        action: step,
        status: 'pending' as const
      })),
      summary: response
    };
  }
}

// Singleton instance
let glmAgent: GLMAgent | null = null;

export function getGLMAgent(): GLMAgent {
  if (!glmAgent) {
    const apiKey = process?.env?.GLM_API_KEY;
    if (!apiKey) {
      throw new Error('GLM_API_KEY environment variable is required');
    }
    glmAgent = new GLMAgent(apiKey);
  }
  return glmAgent;
}
