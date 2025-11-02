"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Network, Cpu, Zap, TrendingUp, Github, FileText, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"

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
        const res = await axios.get("/api/network")
        setStats(res.data.stats)
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      }
    }
    fetchStats()
  }, [])

  const statCards = [
    {
      title: "Active Nodes",
      value: stats.activeNodes.toString(),
      icon: Network,
      description: "Computing nodes online",
    },
    {
      title: "Total Tokens Staked",
      value: stats.totalTokensStaked.toLocaleString(),
      icon: TrendingUp,
      description: "Network value",
    },
    {
      title: "Completed Jobs",
      value: stats.completedJobs.toString(),
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

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-20 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent"
          >
            Decentralized AI Training Network
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8"
          >
            Connect AI model creators, node operators, and validators in a
            decentralized environment
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/submit-job">
              <Button size="lg" className="text-lg px-8 glow">
                Submit Training Job
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="text-lg px-8">
                View Dashboard
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
      >
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <Card className="glass hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <CardDescription>{stat.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="glass">
            <CardHeader>
              <Cpu className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Distributed Computing</CardTitle>
              <CardDescription>
                Leverage the power of decentralized nodes for AI model training
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="glass">
            <CardHeader>
              <Network className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Network Transparency</CardTitle>
              <CardDescription>
                Track job progress and node contributions in real-time
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="glass">
            <CardHeader>
              <Zap className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Token Rewards</CardTitle>
              <CardDescription>
                Earn tokens for contributing computational resources to the network
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="border-t border-border py-12 mt-20"
      >
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="font-bold mb-4">DATN</h3>
            <p className="text-sm text-muted-foreground">
              Decentralized AI Training Network
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Resources</h3>
            <div className="flex flex-col gap-2">
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center md:justify-start gap-2">
                <FileText className="h-4 w-4" />
                Documentation
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center md:justify-start gap-2">
                <Github className="h-4 w-4" />
                GitHub
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-4">Contact</h3>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center md:justify-start gap-2">
              <Mail className="h-4 w-4" />
              support@datn.io
            </Link>
          </div>
        </div>
        <div className="text-center text-sm text-muted-foreground mt-8">
          © 2024 DATN. All rights reserved.
        </div>
      </motion.footer>
    </div>
  )
}
