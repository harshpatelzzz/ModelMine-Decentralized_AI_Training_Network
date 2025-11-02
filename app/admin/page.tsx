"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Shield, CheckCircle2, XCircle, Clock, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import axios from "axios"
import { toast } from "sonner"
import type { Job } from "@/lib/mock-data"

export default function AdminPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session && (session.user as any).role !== "admin") {
      router.push("/dashboard")
      return
    }

    fetchJobs()
  }, [session, router])

  const fetchJobs = async () => {
    try {
      const res = await axios.get("/api/jobs")
      setJobs(res.data)
    } catch (error) {
      toast.error("Failed to fetch jobs")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (jobId: string) => {
    try {
      // In production, make API call to approve
      toast.success("Job approved", {
        description: "The job has been approved and will start processing.",
      })
      fetchJobs()
    } catch (error) {
      toast.error("Failed to approve job")
    }
  }

  const handleReject = async (jobId: string) => {
    try {
      // In production, make API call to reject
      toast.success("Job rejected", {
        description: "The job has been rejected.",
      })
      fetchJobs()
    } catch (error) {
      toast.error("Failed to reject job")
    }
  }

  const pendingJobs = jobs.filter((j) => j.status === "pending")
  const activeJobs = jobs.filter((j) => j.status === "in-progress")
  const completedJobs = jobs.filter((j) => j.status === "completed")

  if (!session || (session.user as any).role !== "admin") {
    return null
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-4xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">
              Manage jobs, monitor network, and oversee operations
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass">
          <CardHeader>
            <CardDescription>Pending Jobs</CardDescription>
            <CardTitle className="text-3xl text-yellow-500">
              {pendingJobs.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="glass">
          <CardHeader>
            <CardDescription>Active Jobs</CardDescription>
            <CardTitle className="text-3xl text-blue-500">
              {activeJobs.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="glass">
          <CardHeader>
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl text-green-500">
              {completedJobs.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="glass">
          <CardHeader>
            <CardDescription>Total Jobs</CardDescription>
            <CardTitle className="text-3xl">{jobs.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Pending Jobs for Approval */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
          <CardDescription>Review and approve pending training jobs</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : pendingJobs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No pending jobs
            </div>
          ) : (
            <div className="space-y-4">
              {pendingJobs.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{job.modelName}</h3>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {job.description}
                    </p>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>Stake: {job.tokenStake.toLocaleString()} tokens</span>
                      <span>Compute: {job.computeRequirement}%</span>
                      <span>
                        Submitted: {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(job.id)}
                      className="gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(job.id)}
                      className="gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Jobs */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>All Jobs</CardTitle>
          <CardDescription>Complete overview of all training jobs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{job.modelName}</span>
                    <Badge
                      variant={
                        job.status === "completed"
                          ? "default"
                          : job.status === "in-progress"
                          ? "default"
                          : "outline"
                      }
                      className={
                        job.status === "completed"
                          ? "bg-green-500"
                          : job.status === "in-progress"
                          ? "bg-blue-500"
                          : ""
                      }
                    >
                      {job.status === "in-progress"
                        ? "In Progress"
                        : job.status === "completed"
                        ? "Completed"
                        : "Pending"}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {job.contributors} contributors • {job.tokensEarned.toLocaleString()} tokens
                    {job.accuracy && ` • ${job.accuracy}% accuracy`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

