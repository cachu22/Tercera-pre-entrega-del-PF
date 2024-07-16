import jwt from 'jsonwebtoken'
import { PRIVATE_KEY } from '../utils/jwt.js';

// Middleware de autorización para administradores y usuarios normales
export function adminOrUserAuth(req, res, next) {
    if (req.session.user) {
        next(); // Permitir acceso si hay una sesión de usuario válida
    } else {
        res.status(403).send('Acceso denegado: Debes iniciar sesión');
    }
}

// Middleware de autorización solo para administradores
export function adminAuth(req, res, next) {
    if (req.session?.user?.isAdmin) { // Asegúrate de usar 'isAdmin'
        next(); // Permitir acceso si es un administrador
    } else {
        res.status(401).send('Acceso no autorizado'); // Devolver un código de estado 401 si no es un administrador
    }
}

export function userAuth(req, res, next) {
    if (req.session && req.user) {
        next();
    } else {
        res.status(401).send('Acceso no autorizado');
    }
}

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).send({ status: 'error', message: 'Token no proporcionado' });

    jwt.verify(token, PRIVATE_KEY, (err, user) => {
        if (err) return res.status(403).send({ status: 'error', message: 'Token inválido' });
        req.user = user;
        next();
    });
};

export const isAuthenticated = async (req, res, next) => {
    // Obtén el token del encabezado Authorization
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    try {
        // Verifica y decodifica el token JWT
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

        // Obtén el usuario usando el ID decodificado del token
        const user = await userService.getUser({ _id: decoded.id });

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        // Añade el ID del usuario al objeto req
        req.user = { id: decoded.id };

        next(); // Pasa al siguiente middleware o controlador
    } catch (error) {
        console.error('Error during authentication:', error);
        return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
};