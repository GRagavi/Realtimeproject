import jwt from 'jsonwebtoken';
import User from '../models/User.js';

//generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};
// Register a new user
export const register = async (req, res, next) => {
  try {
     const { username, email, password } = req.body;
        const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ 
            success: false, 
            error : 
            userExists.email === email ? 
            'User already exists with this email' : 'Username already taken',
         statusCode: 400 });
    }
     

    //create user

    const user = await User.create({ username, email, password });

    //generate token and send response

    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
        },
        token,
      },
      message: 'User registered successfully'
    });
    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      const error = new Error('Invalid user data');
      error.statusCode = 400;
      return next(error);
    }
  } catch (error) {
    next(error);
  }}

// Login user

  export const login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
  
      //validate input
      if(!email || !password) {
        return res.status(400).json(
            { error: 'Please provide email and password', statusCode: 400 , success: false});
      }

      //check for user and password match
      const user = await User.findOne({ email }).select('+password');

      if(!user) {
        return res.status(401).json(
            { error: 'Invalid email or password', statusCode: 401 , success: false});
      }

      //check password
      const isMatch = await user.matchPassword(password);
      if (isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Invalid password',
          statusCode: 401,
        });
      } 
        //generate token
        const token = generateToken(user._id);
        res.status(200).json({
          success: true,
          data: {
            user: {
              id: user._id,
              username: user.username,
              email: user.email,
              profileImage: user.profileImage,
            },
            token,
            message: 'Login successful'
          }
        });
    } catch (error) {
      next(error);
    }
  }

// Get user profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profileImage: user.profileImage,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }}     
    });
  } catch (error) {
    next(error);
  }
};


// Update user profile
export const updateProfile = async (req, res, next) => {
  try {
    const { username, email, profileImage } = req.body;
    const user = await User.findById(req.user._id);
    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      user.profileImage = req.body.profileImage || user.profileImage;
      await user.save();
      res.status(200).json({
        sucsess: true,
        data: {
            id: user._id,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage,
            updatedAt: user.updatedAt,
        },
        message: 'Profile updated successfully',
      });
    } 
  } catch (error) {
    next(error);
  }
};

// Change user password
export const changePassword = async (req, res, next) => {
  try {
      const { currentPassword, newPassword } = req.body;
      if(!currentPassword || !newPassword) {
        return res.status(400).json(
            {error: 'Please provide current and new password', statusCode: 400 , success: false});
      }
    const user = await User.findById(req.user._id).select('+password');

    //check current password
    const isMatch = await user.matchPassword(currentPassword);

    if (user) {
      if (isMatch) {
        user.password = newPassword;
        await user.save();
        return res.status(200).json({ success: true, message: 'Password updated successfully' });
      } else {
        return res.status(401).json({ statusCode: 401, success: false, error: 'Current password is incorrect' });
      }
    } else {
      return res.status(404).json({ statusCode: 404, success: false, error: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};  
export default { register, login, getProfile, updateProfile, changePassword };