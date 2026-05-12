import { useState, useEffect } from "react"

/**
 * Generic hook for fetching data with loading and error states
 * Eliminates duplicate data-fetching logic across multiple hooks
 *
 * @example
 * const { data, loading, error, refetch } = useDataFetch(
 *   () => feedbackService.getAllFeedback(),
 *   []
 * )
 */
export function useDataFetch<T>(
  fetchFn: () => Promise<{ data: T[] | null; error: string | null }>,
  dependencies: any[] = [],
) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = async () => {
    setLoading(true)
    try {
      const { data: result, error: err } = await fetchFn()
      if (err) {
        setError(err)
        setData([])
      } else {
        setData(result || [])
        setError(null)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error")
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refetch()
  }, dependencies)

  return { data, loading, error, refetch }
}

/**
 * Hook for fetching single item data
 * Use when you need to fetch a single item instead of a list
 */
export function useDataFetchSingle<T>(
  fetchFn: () => Promise<{ data: T | null; error: string | null }>,
  dependencies: any[] = [],
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = async () => {
    setLoading(true)
    try {
      const { data: result, error: err } = await fetchFn()
      if (err) {
        setError(err)
        setData(null)
      } else {
        setData(result)
        setError(null)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error")
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refetch()
  }, dependencies)

  return { data, loading, error, refetch }
}
