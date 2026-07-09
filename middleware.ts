import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    if (req.nextUrl.pathname.startsWith("/admin") && req.nextauth.token?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  },
  {
    callbacks: {
      authorized({ req, token }) {
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return token?.role === "admin"
        }
        if (req.nextUrl.pathname.startsWith("/espace-pro")) {
          return token !== null
        }
        return true
      }
    },
    pages: {
      signIn: "/connexion",
    }
  }
)

export const config = {
  matcher: ["/admin/:path*", "/espace-pro/:path*"]
}