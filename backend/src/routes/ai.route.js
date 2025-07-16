import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { reviewUser,generateSchedule,saveSettings } from '../controllers/ai.controller.js';
const router = express.Router()

router.get("/userReview",verifyToken,reviewUser);
router.get("/generate",verifyToken,generateSchedule);
router.post("/saveSettings",verifyToken,saveSettings);

export default router;