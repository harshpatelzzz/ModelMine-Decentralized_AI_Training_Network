// Mock data store (in-memory simulation)
export interface Job {
  id: string
  modelName: string
  datasetUrl: string
  computeRequirement: number
  tokenStake: number
  description: string
  status: "pending" | "in-progress" | "completed"
  progress: number
  accuracy?: number
  contributors: number
  tokensEarned: number
  createdAt: string
  updatedAt: string
}

export interface Node {
  id: string
  name: string
  uptime: number
  tokensEarned: number
  jobsHandled: number
  status: "online" | "offline"
}

export interface NetworkStats {
  activeNodes: number
  totalTokensStaked: number
  completedJobs: number
  averageAccuracy: number
}

// In-memory storage
let jobs: Job[] = [
  {
    id: "1",
    modelName: "GPT-NeoX-20B",
    datasetUrl: "https://dataset.example.com/gpt-neox",
    computeRequirement: 85,
    tokenStake: 5000,
    description: "Large language model training",
    status: "in-progress",
    progress: 67,
    accuracy: 92.3,
    contributors: 42,
    tokensEarned: 3200,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "2",
    modelName: "Vision Transformer",
    datasetUrl: "https://dataset.example.com/vit",
    computeRequirement: 60,
    tokenStake: 3000,
    description: "Computer vision model for image classification",
    status: "completed",
    progress: 100,
    accuracy: 94.7,
    contributors: 28,
    tokensEarned: 3000,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "3",
    modelName: "BERT-Large",
    datasetUrl: "https://dataset.example.com/bert",
    computeRequirement: 45,
    tokenStake: 2000,
    description: "Transformer model for NLP tasks",
    status: "pending",
    progress: 0,
    contributors: 0,
    tokensEarned: 0,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
]

let nodes: Node[] = [
  {
    id: "node-1",
    name: "Node Alpha",
    uptime: 99.8,
    tokensEarned: 15200,
    jobsHandled: 24,
    status: "online",
  },
  {
    id: "node-2",
    name: "Node Beta",
    uptime: 98.5,
    tokensEarned: 12800,
    jobsHandled: 19,
    status: "online",
  },
  {
    id: "node-3",
    name: "Node Gamma",
    uptime: 97.2,
    tokensEarned: 9800,
    jobsHandled: 15,
    status: "online",
  },
  {
    id: "node-4",
    name: "Node Delta",
    uptime: 95.1,
    tokensEarned: 7200,
    jobsHandled: 12,
    status: "offline",
  },
]

export function getJobs(): Job[] {
  return jobs
}

export function getJobById(id: string): Job | undefined {
  return jobs.find((job) => job.id === id)
}

export function createJob(jobData: Omit<Job, "id" | "createdAt" | "updatedAt" | "status" | "progress" | "contributors" | "tokensEarned">): Job {
  const newJob: Job = {
    ...jobData,
    id: Date.now().toString(),
    status: "pending",
    progress: 0,
    contributors: 0,
    tokensEarned: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  jobs.push(newJob)
  return newJob
}

export function getNodes(): Node[] {
  return nodes
}

export function getNetworkStats(): NetworkStats {
  const completedJobs = jobs.filter((j) => j.status === "completed")
  const avgAccuracy =
    completedJobs.length > 0
      ? completedJobs.reduce((sum, j) => sum + (j.accuracy || 0), 0) / completedJobs.length
      : 0
  const totalStaked = jobs.reduce((sum, j) => sum + j.tokenStake, 0)

  return {
    activeNodes: nodes.filter((n) => n.status === "online").length,
    totalTokensStaked: totalStaked,
    completedJobs: completedJobs.length,
    averageAccuracy: avgAccuracy,
  }
}

