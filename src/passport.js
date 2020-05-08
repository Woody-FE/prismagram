import './env'

//https://github.com/mikenicholson/passport-jwt
// jwt토큰을 가져와서 해석하는 파트
import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { prisma } from '../generated/prisma-client';

// secret key -> https://randomkeygen.com
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}

const verifyUser = async (payload, done) => {
    try {
        const user = await prisma.user({ id: payload.id });
        if (user !== null) {
            return done(null, user)
        } else {
            return done(null, false)
        }
    } catch (error) {
        return done(error, false)
    }
}

export const authenticateJwt = (req, res, next) =>
    passport.authenticate("jwt", { session: false }, (error, user) => {
        if (user) {
            req.user = user
        }
        next();
    })(req, res, next);

passport.use(new Strategy(jwtOptions, verifyUser));
passport.initialize();