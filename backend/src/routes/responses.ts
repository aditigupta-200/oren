import express, { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { body, validationResult } from "express-validator"
import { authenticateToken, type AuthRequest } from "../middleware/auth"

const router = express.Router()
const prisma = new PrismaClient()

// All routes require authentication
router.use(authenticateToken)

// Get user's responses
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
  const responses = await prisma.eSGResponse.findMany({
      where: { userId: req.user!.id },
      orderBy: { financialYear: "desc" },
    })

    res.json({ responses })
  } catch (error) {
    console.error("Fetch responses error:", error)
    res.status(500).json({ error: "Failed to fetch responses" })
  }
})

// Get response by financial year
router.get("/:year", async (req: AuthRequest, res: Response) => {
  try {
    const year = Number.parseInt(req.params.year)

  const response = await prisma.eSGResponse.findFirst({
      where: {
        userId: req.user!.id,
        financialYear: year,
      },
    })

    if (!response) {
      return res.status(404).json({ error: "Response not found for this year" })
    }

    res.json({ response })
  } catch (error) {
    console.error("Fetch response error:", error)
    res.status(500).json({ error: "Failed to fetch response" })
  }
})

// Save or update response
router.post(
  "/",
  [
    body("financialYear").isInt({ min: 2000, max: 2100 }).withMessage("Valid financial year required"),
    body("data").isObject().withMessage("Response data required"),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { financialYear, data } = req.body

      // Calculate auto-metrics
      const autoCalculatedMetrics = calculateAutoMetrics(data)

      const responseData = {
        userId: req.user!.id,
        financialYear,
        data: {
          ...data,
          autoCalculated: autoCalculatedMetrics,
        },
      }

      // Upsert response
  const response = await prisma.eSGResponse.upsert({
        where: {
          userId_financialYear: {
            userId: req.user!.id,
            financialYear,
          },
        },
        update: {
          data: responseData.data,
          updatedAt: new Date(),
        },
        create: responseData,
      })

      res.json({
        message: "Response saved successfully",
        response,
      })
    } catch (error) {
      console.error("Save response error:", error)
      res.status(500).json({ error: "Failed to save response" })
    }
  },
)

// Delete response
router.delete("/:year", async (req: AuthRequest, res: Response) => {
  try {
    const year = Number.parseInt(req.params.year)

  const deleted = await prisma.eSGResponse.deleteMany({
      where: {
        userId: req.user!.id,
        financialYear: year,
      },
    })

    if (deleted.count === 0) {
      return res.status(404).json({ error: "Response not found" })
    }

    res.json({ message: "Response deleted successfully" })
  } catch (error) {
    console.error("Delete response error:", error)
    res.status(500).json({ error: "Failed to delete response" })
  }
})

// Helper function to calculate auto-metrics
function calculateAutoMetrics(data: any) {
  const autoCalculated: any = {}

  // Carbon Intensity = (Carbon emissions / Total revenue) T CO2e / INR
  if (data.carbonEmissions && data.totalRevenue && data.totalRevenue > 0) {
    autoCalculated.carbonIntensity = data.carbonEmissions / data.totalRevenue
  }

  // Renewable Electricity Ratio = 100 * (Renewable electricity consumption / Total electricity consumption) %
  if (
    data.renewableElectricityConsumption &&
    data.totalElectricityConsumption &&
    data.totalElectricityConsumption > 0
  ) {
    autoCalculated.renewableElectricityRatio =
      (data.renewableElectricityConsumption / data.totalElectricityConsumption) * 100
  }

  // Diversity Ratio = 100 * (Female Employees / Total Employees) %
  if (data.femaleEmployees && data.totalEmployees && data.totalEmployees > 0) {
    autoCalculated.diversityRatio = (data.femaleEmployees / data.totalEmployees) * 100
  }

  // Community Spend Ratio = 100 * (Community investment spend / Total Revenue) %
  if (data.communityInvestmentSpend && data.totalRevenue && data.totalRevenue > 0) {
    autoCalculated.communitySpendRatio = (data.communityInvestmentSpend / data.totalRevenue) * 100
  }

  return autoCalculated
}

export default router
