import indexRoutes from './routes/index.routes.js'
import express from 'express'
import morgan from "morgan";

const app = express();

import { connectDB } from './db/db.js'

connectDB()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use('/api',indexRoutes)

export default app;