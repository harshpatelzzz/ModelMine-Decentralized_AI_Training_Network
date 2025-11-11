"use client"

import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  delay?: number
}

export function FeatureCard({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className={cn(
          "card relative p-8 h-full",
          "before:absolute before:inset-0 before:rounded-2xl before:opacity-0 before:transition-opacity",
          "before:bg-gradient-to-br before:from-[var(--primary)]/10 before:via-transparent before:to-[var(--secondary)]/10",
          "group-hover:before:opacity-100"
        )}
        whileHover={{ scale: 1.05, y: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Animated gradient border on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--accent)] blur-md opacity-30" />
        </div>

        {/* Icon Container */}
        <motion.div
          className="relative mb-6"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--secondary)]/20 backdrop-blur-sm">
            <Icon className="h-8 w-8 text-[var(--primary)]" />
          </div>
          {/* Icon glow */}
          <motion.div
            className="absolute inset-0 rounded-xl bg-[var(--primary)] blur-xl opacity-0 group-hover:opacity-50"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Title */}
        <h3 className="text-xl font-bold mb-3 text-[var(--text)] group-hover:text-[var(--primary)] transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        <p className="text-[var(--subtext)] leading-relaxed group-hover:text-[var(--text)]/90 transition-colors duration-300">
          {description}
        </p>

        {/* Hover gradient overlay */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--primary)]/0 via-[var(--secondary)]/0 to-[var(--accent)]/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
          initial={false}
        />
      </motion.div>
    </motion.div>
  )
}

