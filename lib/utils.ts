import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generic error handler wrapper for service operations
 * Standardizes error handling across all service functions
 */
export async function handleServiceOperation<T>(
  operation: () => Promise<{ data?: T; error?: any; success?: boolean }>,
  operationName: string,
  options: { logError?: boolean } = { logError: true },
): Promise<{ success: boolean; error: string | null; data?: T }> {
  try {
    const result = await operation();

    if (result.error) {
      const errorMessage = result.error.message || String(result.error);
      if (options.logError) {
        console.error(`${operationName} error:`, result.error);
      }
      return { success: false, error: errorMessage };
    }

    return { success: true, error: null, data: result.data };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    if (options.logError) {
      console.error(`${operationName} exception:`, err);
    }
    return { success: false, error: errorMessage };
  }
}
