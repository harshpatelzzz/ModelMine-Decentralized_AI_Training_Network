"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Clock, CheckCircle2, Loader2, TrendingUp, XCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useSocket } from "@/lib/use-socket"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

interface Job {
  id: string
  title: string
  description?: string
  config: any
  status: "PENDING" | "RUNNING" | "FAILED" | "COMPLETED" | "CANCELED"
  progress: number
  result?: any
  submitterId: string
  createdAt: string
  updatedAt: string
}

type StatusFilter = "all" | "PENDING" | "RUNNING" | "COMPLETED" | "FAILED"

export default function DashboardPage() {
  const { data: session } = useSession()
  const socket = useSocket()
  const [jobs, setJobs] = useState<Job[]>([])
  const [filter, setFilter] = useState<StatusFilter>("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.id) {
      fetchJobs()
    }
  }, [session])

  // Listen for real-time job progress updates
  useEffect(() => {
    if (!socket) return

    const handleProgress = (data: { jobId: string; progress: number; status: string; result?: any }) => {
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === data.jobId
            ? {
                ...job,
                progress: data.progress,
                status: data.status as Job["status"],
                result: data.result || job.result,
              }
            : job
        )
      )

      if (data.status === "COMPLETED") {
        toast.success("Job Completed!", {
          description: `Job "${data.jobId.slice(0, 8)}..." has finished processing.`,
        })
      } else if (data.status === "FAILED") {
        toast.error("Job Failed", {
          description: `Job "${data.jobId.slice(0, 8)}..." encountered an error.`,
        })
      }
    }

    // Listen to all job progress events
    jobs.forEach((job) => {
      socket.on(`job:${job.id}:progress`, handleProgress)
    })

    return () => {
      jobs.forEach((job) => {
        socket.off(`job:${job.id}:progress`, handleProgress)
      })
    }
  }, [socket, jobs.length])

  const fetchJobs = async () => {
    if (!session?.user?.id) return

    try {
      const response = await fetch(`${API_URL}/jobs?userId=${session.user.id}`)
      if (!response.ok) throw new Error("Failed to fetch jobs")
      
      const data = await response.json()
      setJobs(data.jobs || [])
    } catch (error) {
      console.error("Failed to fetch jobs:", error)
      toast.error("Failed to load jobs")
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
    pending: jobs.filter((j) => j.status === "PENDING").length,
    running: jobs.filter((j) => j.status === "RUNNING").length,
    completed: jobs.filter((j) => j.status === "COMPLETED").length,
    failed: jobs.filter((j) => j.status === "FAILED").length,
  }

  const getStatusBadge = (status: Job["status"]) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        )
      case "RUNNING":
        return (
          <Badge variant="default" className="gap-1 bg-blue-500">
            <Loader2 className="h-3 w-3 animate-spin" />
            Running
          </Badge>
        )
      case "COMPLETED":
        return (
          <Badge variant="default" className="gap-1 bg-green-500">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </Badge>
        )
      case "FAILED":
        return (
          <Badge variant="default" className="gap-1 bg-red-500">
            <XCircle className="h-3 w-3" />
            Failed
          </Badge>
        )
      case "CANCELED":
        return (
          <Badge variant="outline" className="gap-1">
            <XCircle className="h-3 w-3" />
            Canceled
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
            <CardDescription>Running</CardDescription>
            <CardTitle className="text-3xl text-blue-500">{stats.running}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl text-green-500">{stats.completed}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardDescription>Failed</CardDescription>
            <CardTitle className="text-3xl text-red-500">{stats.failed}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {(["all", "PENDING", "RUNNING", "COMPLETED", "FAILED"] as StatusFilter[]).map(
            (status) => (
              <Button
                key={status}
                variant={filter === status ? "default" : "outline"}
                onClick={() => setFilter(status)}
                className="capitalize"
              >
                {status === "all" ? "All Jobs" : status.toLowerCase()}
              </Button>
            )
          )}
        </div>
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
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    {getStatusBadge(job.status)}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {job.description || "No description provided"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(job.status === "RUNNING" || job.status === "COMPLETED") && (
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

                  {job.result && (
                    <div className="p-3 rounded-lg bg-primary/10">
                      <div className="flex items-center gap-1 text-sm font-medium mb-2">
                        <TrendingUp className="h-4 w-4" />
                        Results
                      </div>
                      <div className="text-xs space-y-1">
                        {job.result.accuracy && (
                          <div>Accuracy: {job.result.accuracy}%</div>
                        )}
                        {job.result.loss && (
                          <div>Loss: {job.result.loss}</div>
                        )}
                        {job.result.epochs && (
                          <div>Epochs: {job.result.epochs}</div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Created: {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                    {job.updatedAt !== job.createdAt && (
                      <p className="text-xs text-muted-foreground">
                        Updated: {new Date(job.updatedAt).toLocaleDateString()}
                      </p>
                    )}
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
