import { NextResponse } from "next/server"
import { getNodes, getNetworkStats } from "@/lib/mock-data"

export async function GET() {
  try {
    const nodes = getNodes()
    const stats = getNetworkStats()

    return NextResponse.json({
      nodes,
      stats,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch network data" },
      { status: 500 }
    )
  }
}

