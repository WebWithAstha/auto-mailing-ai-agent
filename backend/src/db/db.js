import mongoose from "mongoose";
import { config } from "../config/config.js";

export const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        console.log("MongoDB connected")
        
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}