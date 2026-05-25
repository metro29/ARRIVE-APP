/**
 * Lightweight in-memory cache for server-side request deduplication.
 * Not persistent — safe for single-node / serverless warm instances.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();

const DEFAULT_TTL_MS = 60_000;

export function cacheKey(parts: (string | number | null | undefined)[]): string {
  return parts.filter((p) => p != null && p !== "").join(":");
}

export function getFromCache<T>(key: string): T | undefined {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return undefined;
  }
  return entry.value as T;
}

export function setInCache<T>(
  key: string,
  value: T,
  ttlMs: number = DEFAULT_TTL_MS
): void {
  store.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  });
}

export async function getOrSetCache<T>(
  key: string,
  factory: () => Promise<T>,
  ttlMs: number = DEFAULT_TTL_MS
): Promise<T> {
  const cached = getFromCache<T>(key);
  if (cached !== undefined) return cached;
  const value = await factory();
  setInCache(key, value, ttlMs);
  return value;
}

export function invalidateCache(prefix: string): void {
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key);
  }
}

export function clearCache(): void {
  store.clear();
}
