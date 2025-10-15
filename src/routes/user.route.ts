import express from "express";
import { getUserById, updateUser } from "../controllers/user.controller.ts";
import { verifyAccessToken } from "../middleware/auth.ts";

const router = express.Router();

router.get("/:id", verifyAccessToken, getUserById);
router.put("/:id", verifyAccessToken, updateUser);

export default router;
