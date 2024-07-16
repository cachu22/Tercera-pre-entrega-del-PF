import dotenv from 'dotenv';
import { program } from '../utils/commander.js';
import { MongoSingleton } from '../utils/MongoSingleton.js';

// Cargar las variables de entorno
const { mode } = program.opts();
dotenv.config({
    path: mode === 'production' ? './.env.production' : './.env.development'
});

// Configuración del objeto de configuración
export const objectConfig = {
    port: process.env.PORT || 8000,
    mongo_uri: process.env.MONGO_URI,
    jwt_private_key: process.env.JWT_PRIVATE_KEY,
    persistence: process.env.PERSISTENCE,
    gmail_user: process.env.GMAIL_USER,
    gmail_pass: process.env.GMAIL_PASS,
    twilio_sid: process.env.TWILIO_ACCOUNT_SID,
    twilio_token: process.env.TWILIO_AUTH_TOKEN,
    twilio_phone: process.env.TWILIO_PHONE
};

// Función para conectar a la base de datos
export const connectDb = async () => {
    try {
        MongoSingleton.getInstance(objectConfig.mongo_uri);
        console.log('Conexión a la base de datos establecida correctamente archivo index.js');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
};

// Llamar a la función de conexión al iniciar
connectDb();