import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "../config/config.js";
import User from "../models/userModel.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_REDIRECT_URI,
      scope: ['openid','profile', 'email'], // Ensure proper scopes are requested
      passReqToCallback: true,
      accessType: "offline",
        prompt: "consent",
    },
    async (req,accessToken, refreshToken, profile, done) => {
      // Logic to handle user profile and tokens
    //   console.log("Access Token:", accessToken);
    //     console.log("Refresh Token:", refreshToken);
    //     console.log("Profile:", profile);

      const user = await User.findOne({ email: profile?.emails[0]?.value });

      if (user) {
        user.googleRefreshToken = refreshToken;
        await user.save();
        return done(null, user);
      }
      const newUser = new User({
        email: profile?.emails[0]?.value,
        name: profile?.name?.givenName + " " + profile?.name?.familyName,
        avatar: profile?.photos[0]?.value,
        googleRefreshToken: refreshToken,
      });
      await newUser.save();

      return done(null, newUser);
    }
  )
);


passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser((user, done) => {
    done(null, user);
})

export default passport;