import express from "express";
import { verifyAccessToken } from "../middleware/auth.ts";
import {
    createWorkspace,
    updateWorkspace,
} from "../controllers/workspace.controller.ts";

const router = express.Router();

router.post("/", verifyAccessToken, createWorkspace);
router.patch("/:id", verifyAccessToken, updateWorkspace);

export default router;
