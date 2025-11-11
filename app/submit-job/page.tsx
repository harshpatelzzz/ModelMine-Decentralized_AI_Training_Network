"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { FileText, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function SubmitJobPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    config: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session?.user?.id) {
      toast.error("Authentication required", {
        description: "Please log in to submit a job.",
      })
      router.push("/login")
      return
    }

    setLoading(true)

    try {
      let config
      try {
        config = JSON.parse(formData.config || "{}")
      } catch {
        throw new Error("Invalid JSON in config field")
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
      
      const response = await fetch(`${API_URL}/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          config,
          submitterId: session.user.id,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to submit job")
      }

      const data = await response.json()

      toast.success("Job Submitted!", {
        description: `Job "${data.job.title}" has been queued for processing.`,
        duration: 5000,
      })

      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (error: any) {
      toast.error("Failed to submit job", {
        description: error.message || "Please check your inputs and try again.",
      })
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="glass">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-3xl">Submit Training Job</CardTitle>
                <CardDescription>
                  Create a new decentralized AI training job
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., GPT-NeoX-20B Training"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your AI training job, requirements, and expected outcomes..."
                  rows={5}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="config">Config JSON</Label>
                <Textarea
                  id="config"
                  placeholder='{"epochs": 10, "batchSize": 32, "learningRate": 0.001}'
                  rows={8}
                  value={formData.config}
                  onChange={(e) =>
                    setFormData({ ...formData, config: e.target.value })
                  }
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Enter training configuration as valid JSON
                </p>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full glow"
                disabled={loading}
              >
                {loading ? (
                  "Submitting..."
                ) : (
                  <>
                    <Upload className="mr-2 h-5 w-5" />
                    Submit Job
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

