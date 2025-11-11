import express from "express"
import cors from "cors"
import { createServer } from "http"
import { Server } from "socket.io"
import { PrismaClient } from "@prisma/client"
import { Queue } from "bullmq"
import Redis from "ioredis"
import { jobRoutes } from "./routes/jobs.js"
import { nodeRoutes } from "./routes/nodes.js"
import { ledgerRoutes } from "./routes/ledger.js"
import { authRoutes } from "./routes/auth.js"

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

// Initialize Prisma
// Note: Prisma client is generated in root node_modules
export const prisma = new PrismaClient({
  log: ['error', 'warn'],
})

// Initialize Redis
const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: 6379,
  maxRetriesPerRequest: null, // Required for BullMQ
})

// Initialize BullMQ Queue
export const jobQueue = new Queue("training-jobs", {
  connection: redis,
})

// Make io available globally
export { io }

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

// Routes
app.use("/auth", authRoutes)
app.use("/jobs", jobRoutes)
app.use("/nodes", nodeRoutes)
app.use("/ledger", ledgerRoutes)

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`)

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`)
  })
})

// Subscribe to Redis pub/sub for job progress updates
const subscriber = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: 6379,
  maxRetriesPerRequest: null, // Required for pub/sub
})

subscriber.psubscribe("job:*:progress", (err, count) => {
  if (err) {
    console.error("Error subscribing to Redis:", err)
  } else {
    console.log(`Subscribed to ${count} Redis channels`)
  }
})

subscriber.on("pmessage", (pattern, channel, message) => {
  try {
    const data = JSON.parse(message)
    // Forward to all connected Socket.IO clients
    io.emit(channel, data)
  } catch (error) {
    console.error("Error parsing Redis message:", error)
  }
})

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error:", err)
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  })
})

const PORT = process.env.PORT || 4000

httpServer.listen(PORT, () => {
  console.log(`🚀 API server running on port ${PORT}`)
  console.log(`📡 Socket.IO server ready`)
})

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully...")
  await prisma.$disconnect()
  await redis.quit()
  await jobQueue.close()
  httpServer.close()
  process.exit(0)
})

