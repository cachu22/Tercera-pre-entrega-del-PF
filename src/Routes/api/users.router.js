import { Router } from 'express';
import UserController from '../../controllers/users.controller.js';
import passport from 'passport';

const userController = new UserController()

const router = Router();
const {
  getAll,
  getOne,
  getOneInfo,
  create,
  update,
  deleteData
} = new UserController();

router.get('/', getAll);
router.get('/:uid', getOne);
router.get('/user-info/:uid', getOneInfo);
router.post('/', create);
router.put('/:uid', update);
router.delete('/:uid', deleteData);

export default router;