import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { error } from 'console';


const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            //get token from header
            token = req.headers.authorization.split(' ')[1];
            //verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            //get user from token
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({ success: false, statusCode: 401,message: 'Not authorized, user not found' });
            }
            next();
        } catch (error) {
            console.error('Error in auth middleware:', error.message);
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ statusCode: 401, success: false, error: 'Not authorized, token expired' });
            } 
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } 
    if (!token) {
        return res.status(401).json({ success: false, statusCode: 401, message: 'Not authorized, no token' });
    }
};

export default  protect;