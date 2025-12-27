import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import errorHandler from './middleware/errorHandler';
import { connect } from 'http2';
import connerDB from './config/db.js';

// __dirname workaround for ES modules
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

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