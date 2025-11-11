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
import { motion } from "framer-motion"
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
    <motion.nav
      className="sticky top-0 z-50 w-full border-b border-[var(--border)] backdrop-blur-xl bg-[var(--panel)]/80"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Glow underline */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-50" />
      
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]"
              whileHover={{ scale: 1.1, rotate: 180 }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="h-5 w-5 text-white" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--primary)] bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient">
              DATN
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      className={cn(
                        "gap-2 relative",
                        isActive && "text-[var(--primary)]"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                      {isActive && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]"
                          layoutId="activeTab"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Button>
                  </motion.div>
                </Link>
              )
            })}
            {session?.user && (session.user as any).role === "admin" && (
              <Link href="/admin">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    className={cn(
                      "gap-2 relative",
                      pathname === "/admin" && "text-[var(--primary)]"
                    )}
                  >
                    <Shield className="h-4 w-4" />
                    Admin
                    {pathname === "/admin" && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]"
                        layoutId="activeTab"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Button>
                </motion.div>
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Wallet Connection */}
          {isConnected && address && (
            <motion.div
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--primary)]/10 border border-[var(--border)] backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Wallet className="h-4 w-4 text-[var(--primary)]" />
              <span className="text-sm font-mono text-[var(--text)]">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
              {balance && (
                <span className="text-xs text-[var(--subtext)]">
                  {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                </span>
              )}
            </motion.div>
          )}

          {/* Token Balance */}
          {session?.user && (
            <motion.div
              className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[var(--primary)]/20 to-[var(--secondary)]/20 border border-[var(--border)] backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Coins className="h-4 w-4 text-[var(--primary)]" />
              <span className="text-sm font-semibold text-[var(--text)]">{tokenBalance.toLocaleString()}</span>
              <span className="text-xs text-[var(--subtext)]">DATN</span>
            </motion.div>
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
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                onClick={openConnectModal}
                                size="sm"
                                variant="outline"
                                className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)]/10"
                              >
                                <Wallet className="h-4 w-4 mr-2" />
                                Connect Wallet
                              </Button>
                            </motion.div>
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
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="icon" className="rounded-full border border-[var(--border)] hover:border-[var(--primary)]">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white">
                        {getInitials(session.user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-[var(--panel)]/95 backdrop-blur-xl border-[var(--border)]"
              >
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-[var(--text)]">
                      {session.user.name}
                    </p>
                    <p className="text-xs leading-none text-[var(--subtext)]">
                      {session.user.email}
                    </p>
                    {(session.user as any).role === "admin" && (
                      <Badge
                        variant="default"
                        className="w-fit mt-1 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]"
                      >
                        Admin
                      </Badge>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[var(--border)]" />
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard")}
                  className="text-[var(--text)] hover:bg-[var(--primary)]/10 focus:bg-[var(--primary)]/10"
                >
                  <User className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                {(session.user as any).role === "admin" && (
                  <DropdownMenuItem
                    onClick={() => router.push("/admin")}
                    className="text-[var(--text)] hover:bg-[var(--primary)]/10 focus:bg-[var(--primary)]/10"
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-[var(--border)]" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/login")}
                  className="text-[var(--text)] hover:text-[var(--primary)]"
                >
                  Sign In
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="sm"
                  onClick={() => router.push("/signup")}
                  className="hidden sm:flex bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white hover:opacity-90"
                >
                  Sign Up
                </Button>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  )
}
