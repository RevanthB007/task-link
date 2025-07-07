import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { reviewUser,test } from '../controllers/ai.controller.js';
const router = express.Router()

router.get("/userReview",verifyToken,reviewUser);
router.get("/test",verifyToken,test);

export default router;