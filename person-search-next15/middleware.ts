import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const sessionToken = req.cookies.get("authjs.session-token") || req.cookies.get("__Secure-authjs.session-token")
  const isLoggedIn = !!sessionToken
  const isAuthPage = req.nextUrl.pathname.startsWith("/auth/signin")
  const isPublicPage =
    req.nextUrl.pathname.startsWith("/about") ||
    req.nextUrl.pathname.startsWith("/auth-setup") ||
    req.nextUrl.pathname.startsWith("/security") ||
    req.nextUrl.pathname.startsWith("/database") ||
    req.nextUrl.pathname.startsWith("/github")

  // Allow access to auth pages and public documentation pages
  if (isAuthPage || isPublicPage) {
    return NextResponse.next()
  }

  // Redirect to sign-in if not authenticated and trying to access protected routes
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/signin", req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
