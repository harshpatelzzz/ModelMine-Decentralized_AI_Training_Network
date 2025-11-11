"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Activity, Users, TrendingUp, CheckCircle2, Circle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import axios from "axios"
interface NetworkData {
  nodes: Array<{
    id: string
    name: string
    status: string
    uptime: number
    jobsHandled: number
    tokensEarned: number
    lastSeen?: Date | null
    metrics?: any
  }>
  stats: {
    activeNodes: number
    totalTokensStaked: number
    completedJobs: number
    averageAccuracy: number
  }
  jobTimelineData?: Array<{
    month: string
    pending: number
    inProgress: number
    completed: number
  }>
}

export default function NetworkPage() {
  const [data, setData] = useState<NetworkData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNetworkData()
    // Refresh network data every 5 seconds
    const interval = setInterval(fetchNetworkData, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchNetworkData = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
      const res = await axios.get(`${API_URL}/network`)
      setData(res.data)
    } catch (error) {
      console.error("Failed to fetch network data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Use real job timeline data from API
  const jobTimelineData = data?.jobTimelineData || []

  const tokenDistributionData =
    data?.nodes.map((node) => ({
      name: node.name,
      tokens: node.tokensEarned || 0,
    })) || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-2">Network Overview</h1>
        <p className="text-muted-foreground">
          Monitor network activity, node performance, and token distribution
        </p>
      </motion.div>

      {loading ? (
        <div className="text-center py-12">
          <Activity className="h-8 w-8 animate-pulse mx-auto text-primary" />
        </div>
      ) : !data ? (
        <Card className="glass">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Failed to load network data</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="glass">
              <CardHeader className="pb-2">
                <CardDescription>Active Nodes</CardDescription>
                <CardTitle className="text-3xl flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  {data.stats.activeNodes}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="glass">
              <CardHeader className="pb-2">
                <CardDescription>Total Staked</CardDescription>
                <CardTitle className="text-3xl flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  {data.stats.totalTokensStaked.toLocaleString()}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="glass">
              <CardHeader className="pb-2">
                <CardDescription>Completed Jobs</CardDescription>
                <CardTitle className="text-3xl flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  {data.stats.completedJobs}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="glass">
              <CardHeader className="pb-2">
                <CardDescription>Avg. Accuracy</CardDescription>
                <CardTitle className="text-3xl">
                  {data.stats.averageAccuracy.toFixed(1)}%
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Job Status Over Time</CardTitle>
                <CardDescription>
                  Distribution of job statuses across months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={jobTimelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="pending"
                      stroke="#f59e0b"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="inProgress"
                      stroke="#3b82f6"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="completed"
                      stroke="#10b981"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle>Token Distribution</CardTitle>
                <CardDescription>
                  Tokens earned by each node
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={tokenDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="tokens" fill="rgb(99, 102, 241)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Node Table */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Network Nodes</CardTitle>
              <CardDescription>
                Active and inactive nodes in the network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-medium">Node ID</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Uptime</th>
                      <th className="text-left p-4 font-medium">Jobs Handled</th>
                      <th className="text-left p-4 font-medium">Tokens Earned</th>
                      <th className="text-left p-4 font-medium">Last Seen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.nodes.map((node, index) => (
                      <motion.tr
                        key={node.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-border hover:bg-accent/50 transition-colors"
                      >
                        <td className="p-4 font-medium">{node.name}</td>
                        <td className="p-4">
                          <Badge
                            variant={node.status === "online" ? "default" : "secondary"}
                            className="gap-1"
                          >
                            {node.status === "online" ? (
                              <>
                                <Circle className="h-2 w-2 fill-current" />
                                Online
                              </>
                            ) : node.status === "busy" ? (
                              <>
                                <Circle className="h-2 w-2 fill-current" />
                                Busy
                              </>
                            ) : (
                              <>
                                <Circle className="h-2 w-2 fill-current" />
                                Offline
                              </>
                            )}
                          </Badge>
                        </td>
                        <td className="p-4">{node.uptime}%</td>
                        <td className="p-4">{node.jobsHandled}</td>
                        <td className="p-4 font-medium">
                          {node.tokensEarned.toLocaleString()}
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {node.lastSeen ? new Date(node.lastSeen).toLocaleString() : "Never"}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

