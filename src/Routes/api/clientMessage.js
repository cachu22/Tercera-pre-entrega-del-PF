import express from 'express';
import { sendEmail } from '../../utils/sendMail.js';
import { sendSms } from '../../utils/sendSms.js';

const clientMensajeria = express.Router()

clientMensajeria.get('/sms', async (req, res) => {
    try {
            const user = {
                first_name: 'Adrian',
                last_name: 'Fernández',
                email: 'ladrianfer.87@gmail.com'
            }
            sendSms()
        res.send('sms enviado')
        console.log('test');
    } catch (error) {
        console.log(error);
    }
});

clientMensajeria.get('/mail', async (req, res) => {
    try {
            const user = {
                first_name: 'Adrian',
                last_name: 'Fernández',
                email: 'ladrianfer.87@gmail.com'
            }
            sendEmail({
                email: user.email,
                subject: 'Email de prueba',
                html: `<h1>Bienvenido ${user.first_name} ${user.last_name}</h1>`
        })
        res.send('Email enviado a su casilla')
        console.log('test');
    } catch (error) {
        console.log(error);
    }
});

export default clientMensajeria