import express from 'express'
import { createAccount, signIn } from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/create-account', createAccount)
router.post('/sign-in', signIn)

export default router