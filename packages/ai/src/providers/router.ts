import {
  LLMGenerateParams,
  LLMProvider,
} from "./types.js";

export interface ProviderRouterConfig {
  providers: LLMProvider[];
  cooldownMs?: number;
}

export class ProviderRouter implements LLMProvider {
  readonly name = "auto";

  private readonly providers: LLMProvider[];
  private readonly cooldownMs: number;

  private readonly unhealthyUntil =
    new Map<string, number>();

  constructor(config: ProviderRouterConfig) {
    if (!config.providers.length) {
      throw new Error(
        "No LLM providers are configured."
      );
    }

    this.providers = config.providers;
    this.cooldownMs =
      config.cooldownMs ?? 30_000;
  }

  async generate(
    params: LLMGenerateParams
  ): Promise<string> {
    const errors: string[] = [];

    for (const provider of this.providers) {
      if (this.isCoolingDown(provider.name)) {
        console.log(
          `[AI Router] Skipping ${provider.name} - temporarily unhealthy`
        );

        continue;
      }

      try {
        console.log(
          `[AI Router] Trying ${provider.name}`
        );

        const result =
          await provider.generate(params);

        console.log(
          `[AI Router] ${provider.name} succeeded`
        );

        this.markHealthy(provider.name);

        return result;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : String(error);

        console.error(
          `[AI Router] ${provider.name} failed:`,
          message
        );

        errors.push(
          `${provider.name}: ${message}`
        );

        this.markUnhealthy(provider.name);
      }
    }

    throw new Error(
      `All AI providers failed.\n${errors.join("\n")}`
    );
  }

  private isCoolingDown(
    providerName: string
  ): boolean {
    const until =
      this.unhealthyUntil.get(providerName);

    if (!until) {
      return false;
    }

    if (Date.now() >= until) {
      this.unhealthyUntil.delete(
        providerName
      );

      return false;
    }

    return true;
  }

  private markUnhealthy(
    providerName: string
  ): void {
    this.unhealthyUntil.set(
      providerName,
      Date.now() + this.cooldownMs
    );
  }

  private markHealthy(
    providerName: string
  ): void {
    this.unhealthyUntil.delete(
      providerName
    );
  }
}