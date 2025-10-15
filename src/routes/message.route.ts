import express from 'express'
import { verifyAccessToken } from '../middleware/auth.ts'
import { createMessage } from '../controllers/message.controller.ts'

const router = express.Router()

router.post("/:channelId", verifyAccessToken, createMessage)

export default router