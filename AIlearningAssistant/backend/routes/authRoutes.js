import express from 'express';
import { body } from 'express-validator';
import {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword
} from '../controllers/authController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// User registration route
const registerValidation = [
    body('username').trim().isLength({ min: 3 }).withMessage('Username must be atleast 3 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Please include a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Please include a valid email'),
    body('password').exists().withMessage('Password is required')
];

//public routes
router.post(
    '/register',
    registerValidation,
    register
);


// User login route
router.post(
    '/login',
    loginValidation,
    login
);

//protected routes
// Get user profile
router.get('/profile', protect, getProfile);

// Update user profile
router.put('/profile', protect, updateProfile);

// Change user password
router.put('/change-password', protect, changePassword);

export default router;      
