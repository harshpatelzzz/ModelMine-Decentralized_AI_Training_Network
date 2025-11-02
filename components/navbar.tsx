"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { useAccount, useBalance, useDisconnect } from "wagmi"
import { LayoutDashboard, Network, FileText, Sparkles, LogOut, User, Wallet, Coins, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const navItems = [
  { href: "/", label: "Home", icon: Sparkles },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/submit-job", label: "Submit Job", icon: FileText },
  { href: "/network", label: "Network", icon: Network },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({
    address: address,
  })
  const { disconnect } = useDisconnect()

  const handleLogout = async () => {
    if (isConnected) {
      disconnect()
    }
    await signOut({ redirect: false })
    toast.success("Logged out successfully")
    router.push("/")
    router.refresh()
  }

  const getInitials = (name?: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Mock token balance (in production, fetch from contract)
  const tokenBalance = 1250

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 glass">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              DATN
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "gap-2",
                      isActive && "bg-accent text-accent-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
            {session?.user && (session.user as any).role === "admin" && (
              <Link href="/admin">
                <Button
                  variant={pathname === "/admin" ? "secondary" : "ghost"}
                  className="gap-2"
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Wallet Connection */}
          {isConnected && address && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/50 border border-border">
              <Wallet className="h-4 w-4 text-primary" />
              <span className="text-sm font-mono">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
              {balance && (
                <span className="text-xs text-muted-foreground">
                  {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                </span>
              )}
            </div>
          )}

          {/* Token Balance */}
          {session?.user && (
            <div className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
              <Coins className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">{tokenBalance.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">DATN</span>
            </div>
          )}

          {/* Wallet Connect Button */}
          {!isConnected && (
            <div className="hidden sm:block">
              <ConnectButton.Custom>
                {({ account, chain, openConnectModal, mounted }) => {
                  const ready = mounted
                  const connected = ready && account && chain

                  return (
                    <div
                      {...(!ready && {
                        "aria-hidden": true,
                        style: {
                          opacity: 0,
                          pointerEvents: "none",
                          userSelect: "none",
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <Button onClick={openConnectModal} size="sm" variant="outline">
                              <Wallet className="h-4 w-4 mr-2" />
                              Connect Wallet
                            </Button>
                          )
                        }
                        return null
                      })()}
                    </div>
                  )
                }}
              </ConnectButton.Custom>
            </div>
          )}

          <ThemeToggle />

          {/* User Profile */}
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(session.user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                    {(session.user as any).role === "admin" && (
                      <Badge variant="default" className="w-fit mt-1">
                        Admin
                      </Badge>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                  <User className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                {(session.user as any).role === "admin" && (
                  <DropdownMenuItem onClick={() => router.push("/admin")}>
                    <Shield className="mr-2 h-4 w-4" />
                    Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/login")}
              >
                Sign In
              </Button>
              <Button
                size="sm"
                onClick={() => router.push("/signup")}
                className="hidden sm:flex"
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
