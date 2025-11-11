"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Network, Cpu, Zap, TrendingUp } from "lucide-react"
import axios from "axios"
import { Hero } from "@/components/ui/hero"
import { StatCard } from "@/components/ui/stat-card"
import { FeatureCard } from "@/components/ui/feature-card"
import { Footer } from "@/components/ui/footer"
import { ParticlesCanvas } from "@/components/ui/particles-canvas"

interface NetworkStats {
  activeNodes: number
  totalTokensStaked: number
  completedJobs: number
  averageAccuracy: number
}

export default function Home() {
  const [stats, setStats] = useState<NetworkStats>({
    activeNodes: 0,
    totalTokensStaked: 0,
    completedJobs: 0,
    averageAccuracy: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
        const res = await axios.get(`${API_URL}/network`)
        setStats(res.data.stats)
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      }
    }
    fetchStats()
    // Refresh stats every 5 seconds
    const interval = setInterval(fetchStats, 5000)
    return () => clearInterval(interval)
  }, [])

  const statCards = [
    {
      title: "Active Nodes",
      value: stats.activeNodes,
      icon: Network,
      description: "Computing nodes online",
    },
    {
      title: "Total Tokens Staked",
      value: stats.totalTokensStaked,
      icon: TrendingUp,
      description: "Network value",
    },
    {
      title: "Completed Jobs",
      value: stats.completedJobs,
      icon: Zap,
      description: "Successfully trained",
    },
    {
      title: "Avg. Accuracy",
      value: `${stats.averageAccuracy.toFixed(1)}%`,
      icon: Cpu,
      description: "Model performance",
    },
  ]

  const features = [
    {
      icon: Cpu,
      title: "Distributed Computing",
      description: "Leverage the power of decentralized nodes for AI model training across a global network",
    },
    {
      icon: Network,
      title: "Network Transparency",
      description: "Track job progress and node contributions in real-time with full blockchain transparency",
    },
    {
      icon: Zap,
      title: "Token Rewards",
      description: "Earn tokens for contributing computational resources to the network",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Particles Background */}
      <ParticlesCanvas />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <Hero />

        {/* Stats Grid */}
        <motion.section
          className="container mx-auto px-4 py-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
            variants={containerVariants}
          >
            {statCards.map((stat, index) => (
              <StatCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                description={stat.description}
                delay={index * 0.1}
              />
            ))}
          </motion.div>

          {/* Features Section */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-center mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--primary)] bg-clip-text text-transparent">
                Platform Features
              </span>
            </motion.h2>
            <motion.p
              className="text-center text-[var(--subtext)] mb-12 text-lg"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Everything you need to train AI models in a decentralized network
            </motion.p>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureCard
                  key={feature.title}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}
