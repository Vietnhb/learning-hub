import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Note: Admin routes protection is handled in app/admin/layout.tsx
  // This middleware is kept as a placeholder for potential future enhancements
  // such as request logging, authentication checks, etc.
  return NextResponse.next();
}

// Matcher disabled since admin protection is handled in layout
// Uncomment and update when middleware functionality is needed
// export const config = {
//   matcher: ["/admin/:path*"],
// };
