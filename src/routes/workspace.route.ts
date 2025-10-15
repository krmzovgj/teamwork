import express from 'express'
import { verifyAccessToken } from '../middleware/auth.ts'
import { createWorkspace } from '../controllers/workspace.controller.ts'

const router = express.Router()

router.post('/', verifyAccessToken, createWorkspace)

export default router