import { Router } from "express"
import { prisma, jobQueue, io } from "../index.js"
import { z } from "zod"

const router = Router()

const createJobSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  config: z.record(z.any()),
  submitterId: z.string(),
  tokenStake: z.number().int().min(0).optional().default(100), // Default 100 tokens
})

// Create a new job
router.post("/", async (req, res) => {
  try {
    const { title, description, config, submitterId, tokenStake } = createJobSchema.parse(req.body)

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: submitterId },
    })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Check if user has enough tokens (or initialize if null/0)
    const userBalance = user.tokenBalance ?? 0
    if (userBalance < tokenStake) {
      // If user has 0 balance, give them starting tokens
      if (userBalance === 0) {
        await prisma.user.update({
          where: { id: submitterId },
          data: {
            tokenBalance: 1000, // Give starting tokens
          },
        })
        // Retry the check
        if (1000 < tokenStake) {
          return res.status(400).json({ 
            error: `Insufficient token balance. You have 1000 tokens, but need ${tokenStake}. Please reduce your stake.` 
          })
        }
      } else {
        return res.status(400).json({ 
          error: `Insufficient token balance. You have ${userBalance} tokens, but need ${tokenStake}.` 
        })
      }
    }

    // Deduct tokens from user
    await prisma.user.update({
      where: { id: submitterId },
      data: {
        tokenBalance: {
          decrement: tokenStake,
        },
      },
    })

    // Find an available node to assign the job
    const availableNode = await prisma.node.findFirst({
      where: {
        status: "ONLINE",
        lastSeen: {
          gte: new Date(Date.now() - 30000), // Seen in last 30 seconds
        },
      },
      orderBy: {
        createdAt: "asc", // Assign to oldest node first
      },
    })

    // Create job
    const job = await prisma.job.create({
      data: {
        title,
        description,
        config,
        status: "PENDING",
        progress: 0,
        tokenStake,
        tokenReward: Math.floor(tokenStake * 0.8), // 80% reward for node
        submitterId,
        assignedNodeId: availableNode?.id || null, // Assign to available node
      },
      include: {
        submitter: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    })

    // Add job to queue
    await jobQueue.add("process-job", {
      jobId: job.id,
    })

    res.status(201).json({ job })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors })
    }
    console.error("Create job error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get all jobs for a user
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "userId query parameter is required" })
    }

    const jobs = await prisma.job.findMany({
      where: {
        submitterId: userId,
      },
      include: {
        submitter: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        assignedNode: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    res.json({ jobs })
  } catch (error) {
    console.error("Get jobs error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get job by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        submitter: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        assignedNode: {
          select: {
            id: true,
            name: true,
            status: true,
            metrics: true,
          },
        },
        contributions: {
          include: {
            node: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    if (!job) {
      return res.status(404).json({ error: "Job not found" })
    }

    res.json({ job })
  } catch (error) {
    console.error("Get job error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export { router as jobRoutes }

