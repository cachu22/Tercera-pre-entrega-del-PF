import nodemailer from 'nodemailer';
import { objectConfig } from '../config/index.js';

const { gmail_pass, gmail_user } = objectConfig;

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false, // Cambiar a true para puerto 465
    auth: {
        user: gmail_user,
        pass: gmail_pass
    },
    tls: {
        rejectUnauthorized: false
    }
});

export const sendEmail = async ({email, subject, html}) => {
    return await transport.sendMail({
        from: 'Coder Backend Test',
        to: 'adrianfer_87@hotmail.com',
        subject,
        html,
        attachments: [{
            filename: 'logo-inicio.png',
            path: './src/Public/img/logo-inicio.png',
            cid: 'node.js'
        }]
    });
};