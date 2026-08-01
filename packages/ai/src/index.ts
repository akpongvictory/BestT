// BestT AI Module Placeholder
// Implementation will follow in Sprint 2 / Sprint 3 per docs/05-ai-agent-design.md

export interface AiServiceConfig {
  apiKey?: string;
  modelName?: string;
}

export class BestTTutorAgent {
  private config: AiServiceConfig;

  constructor(config: AiServiceConfig = {}) {
    this.config = config;
  }

  public getStatus(): { ready: boolean; agent: string } {
    return {
      ready: Boolean(this.config.apiKey),
      agent: 'BestT Tutor',
    };
  }
}
