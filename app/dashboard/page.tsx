"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Clock, CheckCircle2, Loader2, TrendingUp, Users, Coins } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import axios from "axios"
import type { Job } from "@/lib/mock-data"

type StatusFilter = "all" | "pending" | "in-progress" | "completed"

export default function DashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filter, setFilter] = useState<StatusFilter>("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const res = await axios.get("/api/jobs")
      setJobs(res.data)
    } catch (error) {
      console.error("Failed to fetch jobs:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredJobs =
    filter === "all"
      ? jobs
      : jobs.filter((job) => job.status === filter)

  const stats = {
    total: jobs.length,
    pending: jobs.filter((j) => j.status === "pending").length,
    inProgress: jobs.filter((j) => j.status === "in-progress").length,
    completed: jobs.filter((j) => j.status === "completed").length,
  }

  const getStatusBadge = (status: Job["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="default" className="gap-1 bg-blue-500">
            <Loader2 className="h-3 w-3 animate-spin" />
            In Progress
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="default" className="gap-1 bg-green-500">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-2">Training Jobs Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and manage your AI training jobs across the network
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardDescription>Total Jobs</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-3xl text-yellow-500">{stats.pending}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardDescription>In Progress</CardDescription>
            <CardTitle className="text-3xl text-blue-500">{stats.inProgress}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl text-green-500">{stats.completed}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(["all", "pending", "in-progress", "completed"] as StatusFilter[]).map(
          (status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              onClick={() => setFilter(status)}
              className="capitalize"
            >
              {status === "all" ? "All Jobs" : status.replace("-", " ")}
            </Button>
          )
        )}
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        </div>
      ) : filteredJobs.length === 0 ? (
        <Card className="glass">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No jobs found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-xl">{job.modelName}</CardTitle>
                    {getStatusBadge(job.status)}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {job.description || "No description provided"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {job.status !== "pending" && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                          Progress
                        </span>
                        <span className="text-sm font-medium">
                          {job.progress}%
                        </span>
                      </div>
                      <Progress value={job.progress} className="h-2" />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex items-center gap-1 text-muted-foreground mb-1">
                        <Users className="h-4 w-4" />
                        Contributors
                      </div>
                      <div className="font-semibold">{job.contributors}</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-muted-foreground mb-1">
                        <Coins className="h-4 w-4" />
                        Tokens
                      </div>
                      <div className="font-semibold">
                        {job.tokensEarned.toLocaleString()}
                      </div>
                    </div>
                    {job.accuracy && (
                      <div>
                        <div className="flex items-center gap-1 text-muted-foreground mb-1">
                          <TrendingUp className="h-4 w-4" />
                          Accuracy
                        </div>
                        <div className="font-semibold">{job.accuracy}%</div>
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1 text-muted-foreground mb-1">
                        <Coins className="h-4 w-4" />
                        Stake
                      </div>
                      <div className="font-semibold">
                        {job.tokenStake.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Created: {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

