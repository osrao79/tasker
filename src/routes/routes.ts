import { Router } from "express";
import { getUserProfile, login, logout, register,generateOTP, verifyOTP, startResetSession, resetPassword } from "../controllers/userController";
import { localVariables, verifyToken } from "../utilities/helperFunctions";
import { sendOtpMail } from "../controllers/mailer";
const router = Router();

router.post('/register', register)
router.post('/login', login)
router.post('/logout', verifyToken, logout)

router.get('/getUserProfile', verifyToken, getUserProfile)

router.get('/generateOTP', verifyToken,localVariables , generateOTP)
router.post('/verifyOTP', verifyToken, verifyOTP)
router.get('/start-reset-session', verifyToken, startResetSession)
router.patch('/reset-password', verifyToken, resetPassword)

router.post('/send-otp', sendOtpMail)
export default router;