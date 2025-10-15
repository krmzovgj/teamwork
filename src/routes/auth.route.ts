import express from 'express'
import { createAccount, signIn } from '../controllers/auth.controller.ts'

const router = express.Router()

router.post('/create-account', createAccount)
router.post('/sign-in', signIn)

export default router