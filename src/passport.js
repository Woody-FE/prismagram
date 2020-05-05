import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, ".env") });

//https://github.com/mikenicholson/passport-jwt
// jwt토큰을 가져와서 해석하는 파트
import passport from 'passport';
import JwtStrategy from 'passport-jwt';
import { prisma } from '../generated/prisma-client';

// secret key -> https://randomkeygen.com
const jwtOptions = {
    jwtFromRequest: JwtStrategy.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secret: process.env.SECRET_KEY
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

passport.use(new JwtStrategy(jwtOptions, verifyUser));