import {google} from "googleapis";
import { config } from "../config/config.js";
import User from "../models/userModel.js";


async function getGoogleAuth(userid){

    const user = await User.findById(userid);

    const oauth2Client = new google.auth.OAuth2(
        config.GOOGLE_CLIENT_ID,
        config.GOOGLE_CLIENT_SECRET,
        config.GOOGLE_REDIRECT_URI
    )
    oauth2Client.setCredentials({ refresh_token: user.getDecryptedRefreshToken()});
    return oauth2Client;

}

export async function sendEmail(userId,to, subject, message) {
    const auth = await getGoogleAuth(userId);
    const gmail = google.gmail({ version: "v1", auth });
    
    const email = [
        `To: ${to}`,
        "Content-Type: text/plain; charset=utf-8",
        "MIME-Version: 1.0",
        `Subject: ${subject}`,
        "",
        message,
    ]

    const base64EncodedEmail = Buffer.from(email.join("\r\n")).toString("base64").replace(/\+/g, "-").replace(/\//g, "_");

    return gmail.users.messages.send({
        userId:'me',
        requestBody: {
            raw: base64EncodedEmail,
        },
    })
    

}