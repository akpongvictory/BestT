import {
  LLMGenerateParams,
  LLMProvider,
} from "./types.js";

export class FallbackProvider implements LLMProvider {
  readonly name = "auto";

  private readonly providers: LLMProvider[];

  constructor(providers: LLMProvider[]) {
    if (providers.length === 0) {
      throw new Error(
        "No AI providers are configured for automatic failover."
      );
    }

    this.providers = providers;
  }

  async generate(
    params: LLMGenerateParams
  ): Promise<string> {
    const errors: string[] = [];

    for (const provider of this.providers) {
      try {
        console.log(
          `[AI] Trying provider: ${provider.name}`
        );

        const result = await provider.generate(params);

        console.log(
          `[AI] Provider succeeded: ${provider.name}`
        );

        return result;
      } catch (error: any) {
        const message =
          error?.message ??
          String(error);

        console.error(
          `[AI] Provider failed: ${provider.name}`,
          message
        );

        errors.push(
          `${provider.name}: ${message}`
        );
      }
    }

    throw new Error(
      `All AI providers failed.\n${errors.join("\n")}`
    );
  }
}