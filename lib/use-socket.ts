"use client"

import { useEffect, useRef } from "react"
import { io, Socket } from "socket.io-client"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

export function useSocket() {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(API_URL, {
      transports: ["websocket"],
    })

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current?.id)
    })

    socketRef.current.on("disconnect", () => {
      console.log("Socket disconnected")
    })

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [])

  return socketRef.current
}

