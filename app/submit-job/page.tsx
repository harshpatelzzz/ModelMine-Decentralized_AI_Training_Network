"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FileText, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import axios from "axios"
import { toast } from "sonner"

export default function SubmitJobPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    modelName: "",
    datasetUrl: "",
    computeRequirement: [50],
    tokenStake: "",
    description: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post("/api/jobs", {
        modelName: formData.modelName,
        datasetUrl: formData.datasetUrl,
        computeRequirement: formData.computeRequirement[0],
        tokenStake: Number(formData.tokenStake),
        description: formData.description,
      })

      toast.success("Job submitted successfully!", {
        description: "Your training job has been added to the network.",
      })

      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } catch (error) {
      toast.error("Failed to submit job", {
        description: "Please check your inputs and try again.",
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
                <Label htmlFor="modelName">Model Name</Label>
                <Input
                  id="modelName"
                  placeholder="e.g., GPT-NeoX-20B"
                  value={formData.modelName}
                  onChange={(e) =>
                    setFormData({ ...formData, modelName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="datasetUrl">Dataset URL</Label>
                <Input
                  id="datasetUrl"
                  type="url"
                  placeholder="https://dataset.example.com/your-dataset"
                  value={formData.datasetUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, datasetUrl: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="computeRequirement">
                    Compute Requirement
                  </Label>
                  <span className="text-sm font-medium text-primary">
                    {formData.computeRequirement[0]}%
                  </span>
                </div>
                <Slider
                  id="computeRequirement"
                  min={10}
                  max={100}
                  step={5}
                  value={formData.computeRequirement}
                  onValueChange={(value) =>
                    setFormData({ ...formData, computeRequirement: value })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Higher requirements may take longer to process but ensure
                  better resource allocation
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tokenStake">Token Stake</Label>
                <Input
                  id="tokenStake"
                  type="number"
                  placeholder="5000"
                  min="100"
                  step="100"
                  value={formData.tokenStake}
                  onChange={(e) =>
                    setFormData({ ...formData, tokenStake: e.target.value })
                  }
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Amount of tokens to stake for this training job
                </p>
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

