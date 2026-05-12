/**
 * Get user-safe error message
 * - Removes sensitive URLs, API keys, tokens
 * - Maps known errors to friendly Vietnamese messages
 * - Limits message length
 */
export function getUserSafeError(error: any): string {
  if (!error) return "Có lỗi xảy ra. Vui lòng thử lại."

  const message =
    typeof error === "string"
      ? error
      : error.message || error.error_description || String(error)

  // Safe patterns that are user-friendly
  const errorMappings: Record<string, string> = {
    "user already registered": "Email này đã được đăng ký. Vui lòng đăng nhập hoặc sử dụng email khác.",
    "already exists": "Email này đã tồn tại trong hệ thống. Vui lòng đăng nhập.",
    "invalid email": "Email không hợp lệ. Vui lòng kiểm tra lại.",
    "invalid password": "Mật khẩu không đủ mạnh. Vui lòng chọn mật khẩu khác.",
    "weak password": "Mật khẩu không đủ mạnh. Vui lòng chọn mật khẩu khác.",
    "invalid credentials": "Email hoặc mật khẩu không chính xác.",
    "email not confirmed": "Email của bạn chưa được xác thực. Vui lòng kiểm tra email.",
    "invalid grant": "Phiên đăng nhập hết hạn. Vui lòng thử lại.",
    "access denied": "Bạn đã từ chối cấp quyền.",
  }

  const lowerMessage = message.toLowerCase()
  for (const [key, value] of Object.entries(errorMappings)) {
    if (lowerMessage.includes(key)) {
      return value
    }
  }

  // Remove sensitive patterns
  const sensitivePatterns = [
    /https?:\/\/[\w.-]+\.\w+/gi, // URLs
    /\.supabase\.co/gi, // Supabase domains
    /eyJ[\w-]*\.eyJ[\w-]*\.[\w-]*/gi, // JWTs
    /sk-[\w]+/gi, // API keys
  ]

  let sanitized = message
  for (const pattern of sensitivePatterns) {
    sanitized = sanitized.replace(pattern, "[internal]")
  }

  if (sanitized.includes("[internal]")) {
    return "Có lỗi xảy ra. Vui lòng thử lại."
  }

  // Limit length
  if (sanitized.length > 200) {
    return "Có lỗi xảy ra. Vui lòng thử lại."
  }

  return sanitized.trim()
}

/**
 * Safe error handler for OAuth flows
 * Maps error codes to user-friendly messages
 */
export function handleOAuthError(
  error: any,
  errorCode?: string,
): { message: string; shouldRedirect: boolean; redirectUrl?: string } {
  const errorType =
    errorCode ||
    error?.error_code ||
    error?.error ||
    (typeof error === "string" ? error : "")

  // Map known error codes to safe messages
  const errorMap: Record<string, { message: string; redirectUrl?: string }> = {
    access_denied: {
      message: "Bạn đã từ chối cấp quyền. Vui lòng thử lại.",
    },
    invalid_grant: {
      message: "Phiên đăng nhập hết hạn. Vui lòng thử lại.",
    },
    invalid_client: {
      message: "Cấu hình OAuth không hợp lệ. Vui lòng liên hệ hỗ trợ.",
    },
    invalid_request: {
      message: "Yêu cầu không hợp lệ. Vui lòng thử lại.",
    },
    server_error: {
      message: "Lỗi máy chủ. Vui lòng thử lại sau.",
    },
    temporarily_unavailable: {
      message: "Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.",
    },
    banned: {
      message: "Tài khoản của bạn đã bị vô hiệu hóa.",
      redirectUrl: "/auth/login?error=banned",
    },
  }

  // Check if error message contains 'banned'
  if (
    typeof error === "string" &&
    error.toLowerCase().includes("banned")
  ) {
    return {
      message: errorMap.banned.message,
      shouldRedirect: true,
      redirectUrl: errorMap.banned.redirectUrl,
    }
  }

  // Check for known error codes
  if (errorMap[errorType as string]) {
    const mapped = errorMap[errorType as string]
    return {
      message: mapped.message,
      shouldRedirect: !!mapped.redirectUrl,
      redirectUrl: mapped.redirectUrl,
    }
  }

  // Use generic safe error message
  const safeMessage = getUserSafeError(error)

  return {
    message: safeMessage,
    shouldRedirect: false,
  }
}

/**
 * Log error safely (for debugging on server-side)
 * This should only be used with console.error in development
 * or sent to a logging service that isn't exposed to users
 */
export function logAuthError(
  errorContext: string,
  error: any,
  isDevelopment: boolean = false,
): void {
  if (!isDevelopment && process.env.NODE_ENV !== "development") {
    // Only log detailed errors in development
    return
  }

  console.error(`[Auth Error - ${errorContext}]`, {
    message: error?.message || error,
    code: error?.error_code || error?.code,
    timestamp: new Date().toISOString(),
  })
}
