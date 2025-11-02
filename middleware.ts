import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const isAuthPage = req.nextUrl.pathname.startsWith("/login") || 
                     req.nextUrl.pathname.startsWith("/signup")

  // Redirect authenticated users away from auth pages
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Protect admin routes
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!token || (token as any).role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  }

  // Allow public routes
  const publicRoutes = ["/", "/login", "/signup", "/api"]
  const isPublicRoute = publicRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  )

  // Require authentication for protected routes
  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}

