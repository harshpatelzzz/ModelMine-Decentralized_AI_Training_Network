import { Router } from "express";
import { prisma } from "../index.js";
import bcrypt from "bcryptjs";
import { z } from "zod";
const router = Router();
const signupSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1),
    password: z.string().min(6),
});
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});
// Sign up
router.post("/signup", async (req, res) => {
    try {
        const { email, name, password } = signupSchema.parse(req.body);
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);
        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                name,
                passwordHash,
                role: "USER",
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        });
        res.status(201).json({ user });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error("Signup error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user || !user.passwordHash) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        // Verify password
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        // Return user (in production, generate JWT token)
        res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
export { router as authRoutes };
//# sourceMappingURL=auth.js.map