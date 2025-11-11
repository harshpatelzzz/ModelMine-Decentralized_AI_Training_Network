"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { ReactNode, useRef } from "react"
import { cn } from "@/lib/utils"

interface GlitchButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  href?: string
  variant?: "primary" | "ghost"
  size?: "sm" | "md" | "lg"
}

export function GlitchButton({
  children,
  className,
  onClick,
  href,
  variant = "primary",
  size = "md",
}: GlitchButtonProps) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, {
    stiffness: 500,
    damping: 100,
  })
  const mouseYSpring = useSpring(y, {
    stiffness: 500,
    damping: 100,
  })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const sizeClasses = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6 text-base",
    lg: "h-12 px-8 text-lg",
  }

  const baseClasses = cn(
    "relative inline-flex items-center justify-center gap-2 rounded-xl font-semibold",
    "transition-all duration-300 overflow-hidden",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]",
    sizeClasses[size],
    className
  )

  const variantClasses = {
    primary: cn(
      "bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--primary)]",
      "bg-size-200 bg-pos-0 hover:bg-pos-100",
      "text-white shadow-[0_0_20px_rgba(148,87,255,0.4)]",
      "hover:shadow-[0_0_30px_rgba(148,87,255,0.6)]"
    ),
    ghost: cn(
      "border-2 border-[var(--primary)] text-[var(--primary)]",
      "bg-transparent hover:bg-[var(--primary)]/10",
      "hover:shadow-[0_0_20px_rgba(148,87,255,0.3)]"
    ),
  }

  const content = (
    <motion.span
      className="relative z-10 flex items-center gap-2"
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </motion.span>
  )

  const buttonContent = (
    <>
      {/* Glitch effect overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--accent)] opacity-0"
        initial={{ opacity: 0, clipPath: "inset(0 0 0 0)" }}
        whileHover={{
          opacity: [0, 0.3, 0, 0.3, 0],
          clipPath: [
            "inset(0 0 0 0)",
            "inset(20% 0 60% 0)",
            "inset(60% 0 20% 0)",
            "inset(0 0 0 0)",
          ],
        }}
        transition={{ duration: 0.3 }}
      />
      {/* Background gradient animation */}
      {variant === "primary" && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--primary)] bg-[length:200%_100%]"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      )}
      {content}
    </>
  )

  if (href) {
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={cn(baseClasses, variantClasses[variant])}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{ textDecoration: "none" }}
      >
        {buttonContent}
      </motion.a>
    )
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      onClick={onClick}
      className={cn(baseClasses, variantClasses[variant])}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {buttonContent}
    </motion.button>
  )
}

