import express from "express";
import { verifyAccessToken } from "../middleware/auth.ts";
import {
    createWorkspace,
    deleteWorkspace,
    getChannelsInWorkspace,
    getUsersInWorkspace,
    getWorkspaceById,
    joinWorkspace,
    leaveWorkspace,
    updateWorkspace,
} from "../controllers/workspace.controller.ts";

const router = express.Router();

router.post("/", verifyAccessToken, createWorkspace);
router.get("/:id", verifyAccessToken, getWorkspaceById);
router.patch("/:id", verifyAccessToken, updateWorkspace);
router.get("/channel/:id", verifyAccessToken, getChannelsInWorkspace);
router.patch("/join/:inviteCode", verifyAccessToken, joinWorkspace);
router.get("/users/:id", verifyAccessToken, getUsersInWorkspace);
router.patch("/leave/:workspaceId", verifyAccessToken, leaveWorkspace);
router.delete("/:id", verifyAccessToken, deleteWorkspace);

export default router;
