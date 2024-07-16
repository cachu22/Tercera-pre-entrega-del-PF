// session -> login - register - logout
import { Router } from 'express';
import usersDaoMongo from '../../daos/MONGO/MONGODBNUBE/usersDao.mongo.js';
import CartDaoMongo from '../../daos/MONGO/MONGODBNUBE/cartsDao.mongo.js';
import passport from 'passport';
import { generateToken } from '../../utils/jwt.js';
import { passportCall } from '../../middlewares/passportCall.middleware.js';
import { authorization } from '../../middlewares/Authorization.middleware.js';
import { createHash, isValidPassword, generateRandomPassword } from '../../utils/bcrypt.js';
import jwt from 'jsonwebtoken';
import UserController from '../../controllers/users.controller.js';
import { isAuthenticated } from '../../middlewares/Auth.middleware.js';


export const sessionsRouter = Router();

const userService = new usersDaoMongo();
const cartService = new CartDaoMongo();
const userController = new UserController()

sessionsRouter.get('/github', passport.authenticate('github', { scope: 'user:email' }), async (req, res) => {});

sessionsRouter.post('/register', async (req, res) => {
    console.log('Se recibió una solicitud de registro');

    const { first_name, last_name, password, email, age } = req.body;

    // Validación de campos obligatorios
    if (!password || !email) {
        console.log('Error: Faltan credenciales en la solicitud de registro');
        return res.status(401).send({ status: 'error', message: 'Debe ingresar todas las credenciales' });
    }

    try {
        // Verificar si ya existe un usuario con el mismo email
        console.log('Buscando usuario en la base de datos...');
        const userFound = await userService.get({ email });

        if (userFound) {
            console.log('Error: El usuario ya existe');
            return res.status(401).send({ status: 'error', message: 'El usuario ya existe' });
        }

        // Preparar nuevo usuario
        const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password)
        };

        // Crear el usuario en la base de datos
        console.log('Creando un nuevo usuario en la base de datos...');
        const result = await userService.create(newUser);

        // Generar token JWT para el usuario registrado
        const token = generateToken({ id: result._id });

        console.log('Usuario registrado exitosamente');
        res.cookie('token', token, { maxAge: 60 * 60 * 1000 * 24, httpOnly: true })
            .redirect('/login');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).send({ status: 'error', message: 'Error al registrar usuario' });
    }
});

sessionsRouter.post('/failregister', async (req, res) => {
    console.log('falló la estrategia');
    res.send({ error: 'failed' });
});

// Función para generar el token JWT
function generateJWTToken(user) {
    return jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: '1h' });
}

sessionsRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(401).json({ status: 'error', error: 'Se deben completar todos los datos' });
    }

    const userFound = await userService.get({ email });

    if (!userFound) {
        return res.status(401).send({ status: 'error', error: 'Usuario no encontrado' });
    }

    // Generar el token JWT
    const token = generateToken({ id: userFound._id, email: userFound.email });

    // Almacenar los datos del usuario en la sesión
    req.session.user = {
        first_name: userFound.first_name,
        last_name: userFound.last_name,
        email: userFound.email,
        isAdmin: userFound.role === 'admin',
        id: userFound._id
    };

    // Establecer una cookie con datos del usuario
    res.cookie('user', JSON.stringify({
        email: req.session.user.email,
        first_name: req.session.user.first_name,
        last_name: req.session.user.last_name,
        isAdmin: req.session.user.isAdmin
    }), { maxAge: 1000000, httpOnly: true });

    console.log('datos sessions router-cookie', req.session.user);

    // Enviar la respuesta con el token JWT y redirigir a la ruta principal
    res.json({ status: 'success', token, redirectTo: '/' });
});

sessionsRouter.post('/faillogin', (req, res) => {
    res.send({ error: 'falló el login' });
});

// sessionsRouter.get('/current', passportCall('jwt'), authorization('admin'), async (req, res) => {
//     console.log(user);
//     res.send(req.user); // Devuelve los datos del usuario asociado al token
// });

// Callback de GitHub con JWT
sessionsRouter.get('/current', isAuthenticated, userController.getOneInfo);

sessionsRouter.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.send({ status: 'error', error: err });
        else return res.redirect('/login');
    });
});

// Ruta para autenticación con GitHub
sessionsRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// Callback de GitHub con JWT
sessionsRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
    // Generar un token JWT para el usuario autenticado
    const token = generateToken({ id: req.user._id });

    // Establecer una cookie con el token JWT
    res.cookie('token', token, { maxAge: 60 * 60 * 1000 * 24, httpOnly: true });

    // Establecer una cookie con los datos del usuario
    res.cookie('user', JSON.stringify({
        email: req.user.email,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        isAdmin: req.user.role === 'admin'
    }), { maxAge: 1000000, httpOnly: true });

    console.log('datos', req.user);

    // Redirigir a la página principal o donde desees
    res.redirect('/');
});

export default sessionsRouter;