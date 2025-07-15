import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { Role } from "../app/modules/user/user.interface";
import { User } from "../app/modules/user/user.model";
import { envVars } from "./env";

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback // profile and done er type gulo passport-google-oauth20 theke import korte hobe.
    ) => {
      try {
        const email = profile?.emails?.[0]?.value;
        if (!email) {
          return done(null, false, { message: "Email not found" });
        }

        let user = await User.findOne({ email });

        // ai email er user db te na thakle user create korte hobe db te
        if (!user) {
          user = await User.create({
            email,
            name: profile?.displayName,
            picture: profile?.photos?.[0]?.value,
            role: Role.USER,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });

          // DB te user create hoia gele, done fulction ke call korbo. 1st perameter a error hole error ke dita hobe, otherwise null dibo. 2nd perameter a user er value ta dibo.
          return done(null, user);
        }
      } catch (error) {
        console.log("Google strategy error", error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user?._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.log(error);
    done(error);
  }
});
