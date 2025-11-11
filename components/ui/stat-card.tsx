"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description: string
  delay?: number
}

export function StatCard({ title, value, icon: Icon, description, delay = 0 }: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null)
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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

  // Count-up animation for numeric values
  const [displayValue, setDisplayValue] = useState(0)
  const isString = typeof value === "string"
  const isPercentage = isString && value.includes("%")
  const numericValue = typeof value === "number" ? value : (isString ? parseFloat(value.replace(/[^0-9.]/g, "")) : 0) || 0
  const isNumeric = typeof value === "number" || (!isNaN(numericValue) && numericValue > 0)

  useEffect(() => {
    if (!isNumeric) {
      return
    }

    const duration = 2000
    const steps = 60
    const increment = numericValue / steps
    let current = 0
    let step = 0

    const timer = setInterval(() => {
      step++
      current = Math.min(numericValue, increment * step)
      setDisplayValue(current)

      if (step >= steps) {
        clearInterval(timer)
        setDisplayValue(numericValue)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [numericValue, isNumeric])

  const formatValue = (val: number) => {
    if (isPercentage) {
      return `${val.toFixed(1)}%`
    }
    if (typeof value === "number" && value >= 1000) {
      return Math.floor(val).toLocaleString()
    }
    return typeof value === "number" ? Math.floor(val).toString() : value
  }

  return (
    <motion.div
      ref={ref}
      className="group relative"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className={cn(
          "card relative p-6 h-full",
          "before:absolute before:inset-0 before:rounded-2xl before:opacity-0 before:transition-opacity",
          "before:bg-gradient-to-br before:from-[var(--primary)]/20 before:via-transparent before:to-[var(--secondary)]/20",
          "group-hover:before:opacity-100"
        )}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.03, z: 50 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Neon border effect on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--primary)] blur-sm opacity-50" />
        </div>

        {/* Icon */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-[var(--subtext)] uppercase tracking-wider">
            {title}
          </h3>
          <motion.div
            className="p-2 rounded-lg bg-gradient-to-br from-[var(--primary)]/20 to-[var(--secondary)]/20"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <Icon className="h-5 w-5 text-[var(--primary)]" />
          </motion.div>
        </div>

        {/* Value */}
        <div className="mb-2">
          <motion.div
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: delay + 0.2, duration: 0.5 }}
          >
            {isNumeric && displayValue > 0 ? formatValue(displayValue) : value}
          </motion.div>
        </div>

        {/* Description */}
        <p className="text-sm text-[var(--subtext)]">{description}</p>

        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[var(--primary)]/0 via-[var(--primary)]/10 to-[var(--primary)]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none" />
      </motion.div>
    </motion.div>
  )
}

