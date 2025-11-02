import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import {
  mainnet,
  sepolia,
  polygon,
  optimism,
  arbitrum,
  base,
} from "wagmi/chains"

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo-project-id"

export const wagmiConfig = getDefaultConfig({
  appName: "DATN - Decentralized AI Training Network",
  projectId: projectId,
  chains: [mainnet, sepolia, polygon, optimism, arbitrum, base],
  ssr: true,
})

