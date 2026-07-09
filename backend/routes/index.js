import express from "express";
import healthController from "../controllers/healthController.js";
import modelsController from "../controllers/modelsController.js";
import chatController from "../controllers/chatController.js";

const router = express.Router();

router.get("/health", healthController);
router.get("/models", modelsController);
router.post("/chat", chatController);

export default router;
