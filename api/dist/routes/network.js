import { Router } from "express";
import { prisma } from "../index.js";
const router = Router();
// Get network statistics
router.get("/", async (req, res) => {
    try {
        // Get all nodes
        const nodes = await prisma.node.findMany({
            include: {
                contributions: true,
                jobs: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        // Get all jobs for statistics
        const allJobs = await prisma.job.findMany();
        // Calculate statistics
        const activeNodes = nodes.filter((node) => node.status === "ONLINE" && node.lastSeen &&
            new Date().getTime() - new Date(node.lastSeen).getTime() < 30000 // Online if seen in last 30 seconds
        ).length;
        const completedJobs = allJobs.filter((job) => job.status === "COMPLETED").length;
        // Calculate average accuracy from completed jobs
        const completedJobsWithResults = allJobs.filter((job) => job.status === "COMPLETED" && job.result && typeof job.result === "object" && "accuracy" in job.result);
        const averageAccuracy = completedJobsWithResults.length > 0
            ? completedJobsWithResults.reduce((sum, job) => {
                const result = job.result;
                return sum + (result.accuracy || 0);
            }, 0) / completedJobsWithResults.length
            : 0;
        // Calculate total tokens staked from all jobs
        const totalTokensStaked = allJobs.reduce((sum, job) => {
            return sum + (job.tokenStake || 0);
        }, 0);
        // Format nodes for frontend
        const formattedNodes = nodes.map((node) => {
            const jobsHandled = node.jobs?.length || 0;
            // Calculate tokens earned from contributions
            const contributions = node.contributions || [];
            const tokensEarned = contributions.reduce((sum, contrib) => {
                return sum + (contrib.tokensEarned || 0);
            }, 0);
            // Calculate uptime percentage (simplified)
            const uptime = node.lastSeen && node.status === "ONLINE" ? 95 : 0;
            return {
                id: node.id,
                name: node.name,
                status: node.status.toLowerCase(),
                uptime,
                jobsHandled,
                tokensEarned: node.totalEarned || tokensEarned, // Use totalEarned from node if available
                tokenBalance: node.tokenBalance || 0,
                lastSeen: node.lastSeen,
                metrics: node.metrics,
            };
        });
        // Get job statistics for charts (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const recentJobs = allJobs.filter((job) => new Date(job.createdAt) >= sixMonthsAgo);
        // Group jobs by month for timeline chart
        const jobTimelineData = [];
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthJobs = recentJobs.filter((job) => {
                const jobDate = new Date(job.createdAt);
                return jobDate.getFullYear() === date.getFullYear() && jobDate.getMonth() === date.getMonth();
            });
            jobTimelineData.push({
                month: monthNames[date.getMonth()],
                pending: monthJobs.filter((j) => j.status === "PENDING").length,
                inProgress: monthJobs.filter((j) => j.status === "RUNNING").length,
                completed: monthJobs.filter((j) => j.status === "COMPLETED").length,
            });
        }
        res.json({
            nodes: formattedNodes,
            stats: {
                activeNodes,
                totalTokensStaked,
                completedJobs,
                averageAccuracy,
            },
            jobTimelineData,
        });
    }
    catch (error) {
        console.error("Get network stats error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
export { router as networkRoutes };
//# sourceMappingURL=network.js.map