import './env';

// https://sendgrid.com/blog/sending-email-nodemailer-sendgrid/
import { adjectives, nouns } from "./words";
import nodemailer from 'nodemailer';
import sgTransport from 'nodemailer-sendgrid-transport';
// jwt 토큰생성
import jwt from 'jsonwebtoken';

// 랜덤한 단어 생성
export const secretGenerator = () => {
    const randomNumber = Math.floor(Math.random() * adjectives.length);
    return `${adjectives[randomNumber]} ${nouns[randomNumber]}`;
};

// console.log(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD, process.env.SENDGRID_API_KEY)

// SENDGRID를 통해서 메일 전송
const sendMail = email => {
    const options = {
        auth: {
            api_user: process.env.SENDGRID_USERNAME,
            api_key: process.env.SENDGRID_PASSWORD
        }
    };
    const client = nodemailer.createTransport(sgTransport(options));
    return client.sendMail(email);
};

export const sendSecretMail = (address, secret) => {
    const email = {
        from: "kti91@likelion.org",
        to: address,
        subject: "🔒Login Secret for Prismagram🔒",
        html: `Hello! Your login secret is <strong>${secret}</strong>.<br/>Copy paste on the app/website to log in`
    };
    return sendMail(email);
};

export const generateToken = id => jwt.sign({ id }, process.env.JWT_SECRET)