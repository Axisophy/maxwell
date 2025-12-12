// ===========================================
// FETCH UTILITIES
// ===========================================
// Shared utilities for API routes with timeout and error handling

export const DEFAULT_TIMEOUT = 10000 // 10 seconds

/**
 * Fetch with timeout support using AbortController
 * @param url - URL to fetch
 * @param options - Fetch options
 * @param timeout - Timeout in milliseconds (default: 10000)
 * @returns Response object
 * @throws Error if timeout or fetch fails
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout: number = DEFAULT_TIMEOUT
): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    })
    return response
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Check if an error is a timeout/abort error
 */
export function isTimeoutError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError'
}
