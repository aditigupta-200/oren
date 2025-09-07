import express from "express";
import { prisma } from "../lib/prisma";
import { authenticateToken, type AuthRequest } from "../middleware/auth";

const router = express.Router();

// Get all ESG responses
router.get("/responses", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const responses = await prisma.eSGResponse.findMany({
      where: {
        userId: req.user?.id
      },
      orderBy: {
        financialYear: 'desc'
      }
    });

    res.json(responses);
  } catch (error) {
    console.error("Error fetching ESG responses:", error);
    res.status(500).json({ error: "Failed to fetch ESG responses" });
  }
});

// Submit new ESG response
router.post("/responses", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const {
      financialYear,
      totalElectricityConsumption,
      renewableElectricityConsumption,
      totalFuelConsumption,
      carbonEmissions,
      totalEmployees,
      femaleEmployees,
      averageTrainingHours,
      communityInvestmentSpend,
      independentBoardMembers,
      hasDataPrivacyPolicy,
      totalRevenue
    } = req.body;

    const response = await prisma.eSGResponse.create({
      data: {
        userId: req.user?.id!,
        financialYear,
        data: {
          totalElectricityConsumption,
          renewableElectricityConsumption,
          totalFuelConsumption,
          carbonEmissions,
          totalEmployees,
          femaleEmployees,
          averageTrainingHours,
          communityInvestmentSpend,
          independentBoardMembers,
          hasDataPrivacyPolicy,
          totalRevenue
        }
      }
    });

    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating ESG response:", error);
    res.status(500).json({ error: "Failed to create ESG response" });
  }
});

// Get single ESG response
router.get("/responses/:id", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const response = await prisma.eSGResponse.findUnique({
      where: {
        id: req.params.id,
        userId: req.user?.id
      }
    });

    if (!response) {
      return res.status(404).json({ error: "ESG response not found" });
    }

    res.json(response);
  } catch (error) {
    console.error("Error fetching ESG response:", error);
    res.status(500).json({ error: "Failed to fetch ESG response" });
  }
});

// Update ESG response
router.put("/responses/:id", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const response = await prisma.eSGResponse.update({
      where: {
        id: req.params.id,
        userId: req.user?.id
      },
      data: {
        data: req.body
      }
    });

    res.json(response);
  } catch (error) {
    console.error("Error updating ESG response:", error);
    res.status(500).json({ error: "Failed to update ESG response" });
  }
});

// Delete ESG response
router.delete("/responses/:id", authenticateToken, async (req: AuthRequest, res) => {
  try {
    await prisma.eSGResponse.delete({
      where: {
        id: req.params.id,
        userId: req.user?.id
      }
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting ESG response:", error);
    res.status(500).json({ error: "Failed to delete ESG response" });
  }
});

export default router;
