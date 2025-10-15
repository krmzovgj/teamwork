import express from "express";
import { deleteUser, getUserById, updateUser } from "../controllers/user.controller.ts";
import { verifyAccessToken } from "../middleware/auth.ts";

const router = express.Router();

router.get("/:id", verifyAccessToken, getUserById);
router.put("/:id", verifyAccessToken, updateUser);
router.delete("/:id", verifyAccessToken, deleteUser)

export default router;
