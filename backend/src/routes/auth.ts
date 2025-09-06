import express, { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt, { type Secret } from "jsonwebtoken"
import { body, validationResult } from "express-validator"
import { authenticateToken, type AuthRequest } from "../middleware/auth"
import { prisma } from "../lib/prisma"

const router = express.Router()

// Register
router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { name, email, password } = req.body

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        return res.status(409).json({ error: "User already exists with this email" })
      }

      // Hash password
      const saltRounds = 12
      const hashedPassword = await bcrypt.hash(password, saltRounds)

      // Create user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      })

      // Generate JWT
  const jwtSecret = process.env.JWT_SECRET as Secret;
      const jwtExpiresIn = process.env.JWT_EXPIRES_IN ?? "7d";
      const token = jwt.sign({ userId: user.id }, jwtSecret, {
        expiresIn: jwtExpiresIn as any,
      });

      res.status(201).json({
        message: "User registered successfully",
        user,
        token,
      })
    } catch (error) {
      console.error("Registration error:", error)
      res.status(500).json({ error: "Registration failed" })
    }
  },
)

// Login
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required"),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { email, password } = req.body

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" })
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" })
      }

      // Generate JWT
  const jwtSecret = process.env.JWT_SECRET as Secret;
      const jwtExpiresIn = process.env.JWT_EXPIRES_IN ?? "7d";
      const token = jwt.sign({ userId: user.id }, jwtSecret, {
        expiresIn: jwtExpiresIn as any,
      });

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      })
    } catch (error) {
      console.error("Login error:", error)
      res.status(500).json({ error: "Login failed" })
    }
  },
)

// Get current user
router.get("/me", authenticateToken, async (req: AuthRequest, res) => {
  res.json({ user: req.user })
})

// Logout (client-side token removal)
router.post("/logout", authenticateToken, (req: AuthRequest, res) => {
  res.json({ message: "Logout successful" })
})

export default router
