import twilio from "twilio";
import { objectConfig } from "../config/index.js";

const {twilio_sid, twilio_token, twilio_phone} = objectConfig

const client = twilio(twilio_sid, twilio_token)

export const sendSms = async () => {
    return await client.messages.create({
        body: 'Pagate la birra para IT',
        from: twilio_phone,
        to: '+5491124629745'
    })
}