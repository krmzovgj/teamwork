import express from "express";
import { verifyAccessToken } from "../middleware/auth.ts";
import {
    createMessage,
    deleteMessage,
    updateMessage,
} from "../controllers/message.controller.ts";

const router = express.Router();

router.post("/:channelId", verifyAccessToken, createMessage);
router.put("/:id", verifyAccessToken, updateMessage);
router.delete("/:id", verifyAccessToken, deleteMessage);

export default router;
