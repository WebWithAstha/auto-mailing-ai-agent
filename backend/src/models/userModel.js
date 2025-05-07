import mongoose from "mongoose";
import CryptoJS from "crypto-js";
import { config } from "../config/config.js";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    name: { type: String, required: true },
    avatar: { type: String },
    googleRefreshToken: { type: String },
}, { timestamps: true });

// Pre-save hook to encrypt the refresh token
userSchema.pre("save", function (next) {
    if (this.isModified("googleRefreshToken")) {
        this.googleRefreshToken = CryptoJS.AES.encrypt(this.googleRefreshToken, config.GOOGLE_ENCRYPTION_KEY).toString();
    }
    next();
});

// Method to decrypt the refresh token
userSchema.methods.getDecryptedRefreshToken = function () {
    const bytes = CryptoJS.AES.decrypt(this.googleRefreshToken, config.GOOGLE_ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
};

// Method to generate JWT token (if needed)
userSchema.methods.generateJwtToken = function () {
    return jwt.sign({ id: this._id }, config.JWT_SECRET, { expiresIn: "1h" });
}

userSchema.statics.verifyJwtToken = async function (token) {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        const user = await this.findById(decoded.id);
        if(!user) {
            // throw new Error("User not found");
            console.log("user not found")
        }
        return user;

};

const User = mongoose.model("user", userSchema);

export default User;