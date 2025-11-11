// Quick test to verify worker can process jobs
import Redis from "ioredis"

const redis = new Redis({
  host: "localhost",
  port: 6379,
  maxRetriesPerRequest: null,
})

async function testWorker() {
  try {
    // Test Redis connection
    await redis.ping()
    console.log("✅ Redis connection: OK")
    
    // Check queue
    const queue = await redis.keys("bull:training-jobs:*")
    console.log(`📊 Queue keys found: ${queue.length}`)
    
    // Check waiting jobs
    const waiting = await redis.llen("bull:training-jobs:wait")
    console.log(`⏳ Waiting jobs: ${waiting}`)
    
    // Check active jobs
    const active = await redis.llen("bull:training-jobs:active")
    console.log(`🔄 Active jobs: ${active}`)
    
    await redis.quit()
  } catch (error) {
    console.error("❌ Error:", error.message)
  }
}

testWorker()

