/**
 * @file cache.ts
 * @description Capa de caché en memoria de alto rendimiento con Time-To-Live (TTL),
 * invalidación dirigida y métricas de rendimiento para acelerar tiempos de respuesta.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttlMs: number;
}

interface MetricasCache {
  hits: number;
  misses: number;
  evictions: number;
  totalConsultas: number;
}

class MemoryCacheService {
  private store: Map<string, CacheEntry<unknown>> = new Map();
  private metricas: MetricasCache = {
    hits: 0,
    misses: 0,
    evictions: 0,
    totalConsultas: 0
  };
  private defaultTTL: number = 5 * 60 * 1000; // 5 minutos por defecto

  /**
   * Obtiene un elemento en caché si existe y no ha expirado.
   */
  get<T>(key: string): T | null {
    this.metricas.totalConsultas++;
    const entry = this.store.get(key);

    if (!entry) {
      this.metricas.misses++;
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > entry.ttlMs) {
      this.store.delete(key);
      this.metricas.evictions++;
      this.metricas.misses++;
      return null;
    }

    this.metricas.hits++;
    return entry.data as T;
  }

  /**
   * Almacena un elemento con clave y TTL opcional.
   */
  set<T>(key: string, data: T, ttlMs?: number): void {
    this.store.set(key, {
      data,
      timestamp: Date.now(),
      ttlMs: ttlMs || this.defaultTTL
    });
  }

  /**
   * Invalida una clave específica o un patrón de claves.
   */
  invalidate(keyOrPrefix: string): void {
    if (this.store.has(keyOrPrefix)) {
      this.store.delete(keyOrPrefix);
      return;
    }

    // Invalida por prefijo (ej: "solicitud:")
    for (const key of this.store.keys()) {
      if (key.startsWith(keyOrPrefix)) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Limpia toda la memoria caché.
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * Recupera o computa un valor si no está en caché (Patrón Cache-Aside).
   */
  async getOrSet<T>(key: string, fetchFn: () => Promise<T>, ttlMs?: number): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const fresh = await fetchFn();
    this.set(key, fresh, ttlMs);
    return fresh;
  }

  /**
   * Retorna estadísticas del caché para auditoría y paneles.
   */
  getMetricas(): MetricasCache & { tamanoActual: number; ratioAciertosPct: number } {
    const total = this.metricas.totalConsultas;
    const ratio = total > 0 ? (this.metricas.hits / total) * 100 : 0;
    return {
      ...this.metricas,
      tamanoActual: this.store.size,
      ratioAciertosPct: Math.round(ratio * 10) / 10
    };
  }
}

export const cacheService = new MemoryCacheService();
