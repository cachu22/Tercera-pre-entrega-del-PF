// import { Router } from 'express';
// import { authenticateToken, userAuth, adminAuth, adminOrUserAuth } from '../../middlewares/Auth.middleware.js';

// const router = Router();
// const {
// addProductToCart,
// } = new logueadosController();

// router.get('/', getAll);

// router.get('/user-info', userAuth, async (req, res) => {
//   try {
//       // `req.user` contiene los datos del usuario decodificados del token
//       const userDto = req.user;
//       res.json({ status: 'success', payload: userDto });
//   } catch (error) {
//       console.log(error);
//       res.status(500).send({ status: 'error', message: 'Error al obtener la información del usuario' });
//   }
// });

// export default router;