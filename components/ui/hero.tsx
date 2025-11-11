"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { GlitchButton } from "./glitch-button"
import Link from "next/link"

export function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <motion.section
      className="relative min-h-[80vh] flex items-center justify-center px-4 py-20 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Aurora Background */}
      <div className="aurora-bg" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Main Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
        >
          <span className="block bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--accent)] bg-clip-text text-transparent animate-gradient">
            Decentralized
          </span>
          <span className="block bg-gradient-to-r from-[var(--secondary)] via-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent animate-gradient">
            AI Training Network
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl lg:text-2xl text-[var(--subtext)] mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Connect AI model creators, node operators, and validators in a
          <br />
          <span className="text-[var(--secondary)]">decentralized environment</span> powered by blockchain
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <GlitchButton href="/submit-job" size="lg" variant="primary">
            Submit Training Job
            <ArrowRight className="h-5 w-5" />
          </GlitchButton>
          <GlitchButton href="/dashboard" size="lg" variant="ghost">
            View Dashboard
          </GlitchButton>
        </motion.div>

        {/* Floating particles effect */}
        <motion.div
          className="absolute -top-20 -left-20 w-72 h-72 bg-[var(--primary)]/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-[var(--secondary)]/20 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </motion.section>
  )
}

