import express from "express";
import { verifyAccessToken } from "../middleware/auth.ts";
import {
    createChannel,
    deleteChannel,
    getChannelById,
    updateChannel,
} from "../controllers/channel.controller.ts";

const router = express.Router();

router.post("/:workspaceId", verifyAccessToken, createChannel);
router.get("/:id", verifyAccessToken, getChannelById);
router.patch("/:id", verifyAccessToken, updateChannel);
router.delete("/:id", verifyAccessToken, deleteChannel);

export default router;
