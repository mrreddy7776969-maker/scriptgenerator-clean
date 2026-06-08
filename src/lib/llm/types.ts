export interface LlmProvider {
  name: string;
  isConfigured: () => boolean;
  generate: (prompt: string) => Promise<string>;
}
