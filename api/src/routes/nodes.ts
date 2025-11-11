import { Router } from "express"
import { prisma } from "../index.js"
import { z } from "zod"

const router = Router()

const registerNodeSchema = z.object({
  name: z.string().min(1),
})

const heartbeatSchema = z.object({
  nodeId: z.string(),
  metrics: z.record(z.any()),
})

// Register a new node
router.post("/register", async (req, res) => {
  try {
    const { name } = registerNodeSchema.parse(req.body)

    const node = await prisma.node.create({
      data: {
        name,
        status: "ONLINE",
        lastSeen: new Date(),
      },
    })

    res.status(201).json({ node })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors })
    }
    console.error("Register node error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Update node heartbeat
router.post("/heartbeat", async (req, res) => {
  try {
    const { nodeId, metrics } = heartbeatSchema.parse(req.body)

    const node = await prisma.node.findUnique({
      where: { id: nodeId },
    })

    if (!node) {
      return res.status(404).json({ error: "Node not found" })
    }

    const updatedNode = await prisma.node.update({
      where: { id: nodeId },
      data: {
        metrics,
        lastSeen: new Date(),
        status: "ONLINE",
      },
    })

    res.json({ node: updatedNode })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors })
    }
    console.error("Heartbeat error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get all nodes
router.get("/", async (req, res) => {
  try {
    const nodes = await prisma.node.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    res.json({ nodes })
  } catch (error) {
    console.error("Get nodes error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export { router as nodeRoutes }

