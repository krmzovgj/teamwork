import express from "express";
import { verifyAccessToken } from "../middleware/auth.ts";
import {
    createTask,
    deleteTask,
    updateTask,
} from "../controllers/task.controller.ts";

const router = express.Router();

router.post("/:channelId", verifyAccessToken, createTask);
router.patch("/:id", verifyAccessToken, updateTask);
router.delete("/:id", verifyAccessToken, deleteTask);

export default router;
