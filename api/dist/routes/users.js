import { Router } from "express";
import { prisma } from "../index.js";
const router = Router();
// Get user balance
router.get("/:id/balance", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                tokenBalance: true,
            },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ user });
    }
    catch (error) {
        console.error("Get user balance error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Initialize token balance for existing users (admin function)
router.post("/initialize-balances", async (req, res) => {
    try {
        // Update all users with 0 or null balance to 1000 tokens
        const result = await prisma.user.updateMany({
            where: {
                OR: [
                    { tokenBalance: 0 },
                    { tokenBalance: null },
                ],
            },
            data: {
                tokenBalance: 1000,
            },
        });
        res.json({
            message: `Initialized token balances for ${result.count} users`,
            count: result.count,
        });
    }
    catch (error) {
        console.error("Initialize balances error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
export { router as userRoutes };
//# sourceMappingURL=users.js.map