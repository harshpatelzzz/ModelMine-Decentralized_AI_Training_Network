import { Router } from "express"
import { prisma } from "../index.js"

const router = Router()

// Get all ledger blocks
router.get("/", async (req, res) => {
  try {
    const blocks = await prisma.ledgerBlock.findMany({
      orderBy: {
        timestamp: "desc",
      },
      take: 100, // Limit to last 100 blocks
    })

    res.json({ blocks })
  } catch (error) {
    console.error("Get ledger error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get ledger block by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params

    const block = await prisma.ledgerBlock.findUnique({
      where: { id },
    })

    if (!block) {
      return res.status(404).json({ error: "Block not found" })
    }

    res.json({ block })
  } catch (error) {
    console.error("Get ledger block error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export { router as ledgerRoutes }

