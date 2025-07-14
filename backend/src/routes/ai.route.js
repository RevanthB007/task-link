import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { reviewUser,generateSchedule } from '../controllers/ai.controller.js';
const router = express.Router()

router.get("/userReview",verifyToken,reviewUser);
router.get("/generate",verifyToken,generateSchedule);

export default router;