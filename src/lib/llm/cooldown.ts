const lastRequest = new Map<string, number>();
const COOLDOWN_MS = 8000;

export function enforceCooldown(email: string): void {
  const now = Date.now();
  const last = lastRequest.get(email) ?? 0;
  const remaining = COOLDOWN_MS - (now - last);

  if (remaining > 0) {
    throw new Error(
      `Please wait ${Math.ceil(remaining / 1000)} seconds before generating again.`
    );
  }

  lastRequest.set(email, now);
}
