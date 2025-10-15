import express from "express";
import { verifyAccessToken } from "../middleware/auth.ts";
import {
    createWorkspace,
    deleteWorkspace,
    getWorkspaceById,
    updateWorkspace,
} from "../controllers/workspace.controller.ts";

const router = express.Router();

router.post("/", verifyAccessToken, createWorkspace);
router.get("/:id", verifyAccessToken, getWorkspaceById);
router.patch("/:id", verifyAccessToken, updateWorkspace);
router.delete("/:id", verifyAccessToken, deleteWorkspace);

export default router;
