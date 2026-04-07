import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Admin routes protection will be handled in layout
  // This is a placeholder for future enhancements
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
