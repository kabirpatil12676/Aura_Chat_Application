import { Router } from "express";
import {
    getAdminStats,
    getAdminUsers,
    getAdminChannels,
    getAdminFeedbacks,
} from "../controllers/AdminController.js";

const adminRoutes = Router();

adminRoutes.get("/stats", getAdminStats);
adminRoutes.get("/users", getAdminUsers);
adminRoutes.get("/channels", getAdminChannels);
adminRoutes.get("/feedbacks", getAdminFeedbacks);

export default adminRoutes;
