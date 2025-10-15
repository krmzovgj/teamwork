import express from 'express'
import { verifyAccessToken } from '../middleware/auth.ts'
import { createChannel, getChannelById } from '../controllers/channel.controller.ts'

const router = express.Router()

router.post("/:workspaceId", verifyAccessToken, createChannel)
router.get("/:id", verifyAccessToken, getChannelById)

export default router