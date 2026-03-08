import { Router } from "express";
import { submitFeedback } from "../controllers/FeedbackController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const feedbackRoutes = Router();

feedbackRoutes.post("/submit", verifyToken, submitFeedback);

export default feedbackRoutes;
