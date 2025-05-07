import { Router } from "express";
import passport from "../auth/passport.js";
const router = Router();

router.get('/google',passport.authenticate('google',{
    scope: ['profile','email','https://mail.google.com/','https://www.googleapis.com/auth/calendar'],
    accessType: 'offline',
    prompt: 'consent'
}))

router.get('/google/callback',passport.authenticate('google',{
    failureRedirect: '/login',
    session: false,
    // successRedirect: '/'
}),async (req,res)=>{

    const user = req.user;
    const token = user.generateJwtToken();

    res.cookie('token',token,{
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        // maxAge: 24 * 60 * 60 * 1000 // 1 day
    })


    res.redirect('http://localhost:5173/agent')
})

export default router;