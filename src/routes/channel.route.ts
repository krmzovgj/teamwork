import express from "express";
import { verifyAccessToken } from "../middleware/auth.ts";
import {
    createChannel,
    deleteChannel,
    getChannelById,
    getMesssagesInChannel,
    getTasksInChannel,
    updateChannel,
} from "../controllers/channel.controller.ts";

const router = express.Router();

router.post("/:workspaceId", verifyAccessToken, createChannel);
router.get("/:id", verifyAccessToken, getChannelById);
router.patch("/:id", verifyAccessToken, updateChannel);
router.get("/task/:id", verifyAccessToken, getTasksInChannel);
router.get("/message/:id", verifyAccessToken, getMesssagesInChannel);
router.delete("/:id", verifyAccessToken, deleteChannel);

export default router;
