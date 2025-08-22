import express from "express";
import { getHealthRecords, createHealthRecord, updateHealthRecord, deleteHealthRecord } from "../controllers/healthRecords.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Apply authentication to all routes
router.use(requireAuth);
router.use(requireRole(['patient', 'doctor']));

// Get all health records for the authenticated user
router.get("/", getHealthRecords);

// Add a new health record (manual)
router.post("/", createHealthRecord);

// Update a health record (manual only)
router.put("/:id", updateHealthRecord);

// Delete a health record (manual only)
router.delete("/:id", deleteHealthRecord);

export default router;
