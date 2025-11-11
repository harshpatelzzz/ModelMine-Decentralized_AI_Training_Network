"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { FileText, Github, Mail, Sparkles } from "lucide-react"

export function Footer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  }

  return (
    <motion.footer
      className="relative border-t border-[var(--border)] mt-32 py-12"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* Glow line effect */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-50" />

      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <motion.div variants={itemVariants}>
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
                DATN
              </span>
            </Link>
            <p className="text-sm text-[var(--subtext)]">
              Decentralized AI Training Network
            </p>
          </motion.div>

          {/* Resources */}
          <motion.div variants={itemVariants}>
            <h3 className="font-bold mb-4 text-[var(--text)]">Resources</h3>
            <div className="flex flex-col gap-3">
              <Link
                href="#"
                className="text-sm text-[var(--subtext)] hover:text-[var(--primary)] transition-colors flex items-center gap-2 group"
              >
                <FileText className="h-4 w-4 group-hover:scale-110 transition-transform" />
                Documentation
              </Link>
              <Link
                href="https://github.com/harshpatelzzz/decentralized-ai-training-network"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--subtext)] hover:text-[var(--primary)] transition-colors flex items-center gap-2 group"
              >
                <Github className="h-4 w-4 group-hover:scale-110 transition-transform" />
                GitHub
              </Link>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants}>
            <h3 className="font-bold mb-4 text-[var(--text)]">Contact</h3>
            <Link
              href="mailto:harshpatel174101@gmail.com"
              className="text-sm text-[var(--subtext)] hover:text-[var(--primary)] transition-colors flex items-center gap-2 group"
            >
              <Mail className="h-4 w-4 group-hover:scale-110 transition-transform" />
              harshpatel174101@gmail.com
            </Link>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          variants={itemVariants}
          className="text-center text-sm text-[var(--subtext)] pt-8 border-t border-[var(--border)]"
        >
          © 2024 DATN. All rights reserved.
        </motion.div>
      </div>
    </motion.footer>
  )
}

