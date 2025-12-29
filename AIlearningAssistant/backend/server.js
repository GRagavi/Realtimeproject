import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import errorHandler from './middleware/errorHandler.js';
import { connect } from 'http2';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
// __dirname workaround for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//initialize express app
const app = express();

//connect to database
connectDB();

//middlewares
app.use(cors({
    origin: '*', // Adjust the origin as needed for your frontend application
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Routes
app.use('/api/auth', authRoutes);
//app.use('/api/user', userRoutes);
app.use('/api/document', documentRoutes);
app.use(errorHandler)
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/user', require('./routes/user'));
// app.use('/api/document', require('./routes/document'));
// app.use('/api/chat', require('./routes/chat'));
// app.use('/api/admin', require('./routes/admin'));
// app.use('/api/subscription', require('./routes/subscription'));

// Error handling middleware
app.use((req,res)=>{
    res.status(404).json({
        success: false,
        error: 'Route not found',
        statuscode: 404});
});

//start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});