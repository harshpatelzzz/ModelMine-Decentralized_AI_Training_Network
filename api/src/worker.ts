import { Worker } from "bullmq"
import Redis from "ioredis"
import { PrismaClient } from "@prisma/client"
import { createHash } from "crypto"

const prisma = new PrismaClient()

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: 6379,
  maxRetriesPerRequest: null, // Required for BullMQ
})

// Initialize Socket.IO client for worker (if needed)
// In production, you might want to use Redis pub/sub instead
let socketIOClient: any = null

// Process job function
async function processJob(jobData: { jobId: string }) {
  const { jobId } = jobData

  console.log(`🔄 Processing job: ${jobId}`)

  try {
    // Get job from database
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        assignedNode: true,
      },
    })

    if (!job) {
      throw new Error(`Job ${jobId} not found`)
    }

    // Update job status to RUNNING
    await prisma.job.update({
      where: { id: jobId },
      data: {
        status: "RUNNING",
        progress: 0,
      },
    })

    // Emit initial progress via Redis pub/sub
    redis.publish(`job:${jobId}:progress`, JSON.stringify({
      jobId,
      progress: 0,
      status: "RUNNING",
    }))

    // Simulate training in 10 steps
    const totalSteps = 10
    for (let step = 1; step <= totalSteps; step++) {
      // Wait 1 second per step
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const progress = Math.round((step / totalSteps) * 100)

      // Update job progress in database
      await prisma.job.update({
        where: { id: jobId },
        data: {
          progress,
        },
      })

      // Emit progress update via Redis pub/sub
      redis.publish(`job:${jobId}:progress`, JSON.stringify({
        jobId,
        progress,
        status: "RUNNING",
        step,
        totalSteps,
      }))

      console.log(`Job ${jobId}: Progress ${progress}% (Step ${step}/${totalSteps})`)
    }

    // Generate result
    const result = {
      accuracy: 94.7,
      loss: 0.052,
      epochs: 10,
      completedAt: new Date().toISOString(),
    }

    // Update job to COMPLETED
    await prisma.job.update({
      where: { id: jobId },
      data: {
        status: "COMPLETED",
        progress: 100,
        result,
      },
    })

    // Emit completion via Redis pub/sub
    redis.publish(`job:${jobId}:progress`, JSON.stringify({
      jobId,
      progress: 100,
      status: "COMPLETED",
      result,
    }))

    // Create ledger block
    const previousBlock = await prisma.ledgerBlock.findFirst({
      orderBy: { timestamp: "desc" },
    })

    const blockData = {
      jobId,
      result,
      timestamp: new Date().toISOString(),
    }

    const dataString = JSON.stringify(blockData)
    const prevHash = previousBlock?.hash || "0"
    const hashInput = `${prevHash}${dataString}${Date.now()}`
    const hash = createHash("sha256").update(hashInput).digest("hex")

    await prisma.ledgerBlock.create({
      data: {
        prevHash: previousBlock?.hash || null,
        data: blockData,
        hash,
      },
    })

    console.log(`✅ Job ${jobId} completed and added to ledger`)

    return { success: true, jobId, result }
  } catch (error) {
    console.error(`Error processing job ${jobId}:`, error)

    // Update job to FAILED
    await prisma.job.update({
      where: { id: jobId },
      data: {
        status: "FAILED",
      },
    })

    // Emit failure via Redis pub/sub
    redis.publish(`job:${jobId}:progress`, JSON.stringify({
      jobId,
      status: "FAILED",
      error: error instanceof Error ? error.message : "Unknown error",
    }))

    throw error
  }
}

// Create worker
const worker = new Worker(
  "training-jobs",
  async (job) => {
    return await processJob(job.data as { jobId: string })
  },
  {
    connection: redis,
    concurrency: 5, // Process up to 5 jobs concurrently
  }
)

worker.on("completed", (job) => {
  console.log(`Job ${job?.id} completed`)
})

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err)
})

console.log("🔄 Worker started and listening for jobs...")

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down worker...")
  await worker.close()
  await prisma.$disconnect()
  await redis.quit()
  process.exit(0)
})

