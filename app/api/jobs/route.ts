import { NextRequest, NextResponse } from "next/server"
import { getJobs, createJob } from "@/lib/mock-data"

export async function GET() {
  try {
    const jobs = getJobs()
    return NextResponse.json(jobs)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { modelName, datasetUrl, computeRequirement, tokenStake, description } = body

    if (!modelName || !datasetUrl || !computeRequirement || !tokenStake) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Simulate transaction processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newJob = createJob({
      modelName,
      datasetUrl,
      computeRequirement: Number(computeRequirement),
      tokenStake: Number(tokenStake),
      description: description || "",
    })

    return NextResponse.json(
      {
        ...newJob,
        transactionHash: `0x${Math.random().toString(16).slice(2, 66)}`,
        message: "Transaction successful! Job submitted to the network.",
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    )
  }
}

