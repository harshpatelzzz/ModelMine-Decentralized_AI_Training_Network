"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { LayoutDashboard, Network, FileText, Sparkles, Shield, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/submit-job", label: "Submit Job", icon: FileText },
  { href: "/network", label: "Network", icon: Network },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-sidebar">
      <div className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  isActive && "bg-accent text-accent-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Button>
            </Link>
          )
        })}
        {session?.user && (session.user as any).role === "admin" && (
          <Link href="/admin">
            <Button
              variant={pathname === "/admin" ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3",
                pathname === "/admin" && "bg-accent text-accent-foreground"
              )}
            >
              <Shield className="h-5 w-5" />
              Admin Panel
            </Button>
          </Link>
        )}
      </div>
    </aside>
  )
}

