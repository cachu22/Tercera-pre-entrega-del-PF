import { userService } from "../service/index.js";
import UserDto from "../dtos/users.dto.js";


class UserController {
    constructor() {
        this.userService = userService;
    }

    getAll = async (req, res) => {
        try {
            const users = await this.userService.getUsers();
            res.send({ status: 'success', payload: users });
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: 'error', message: 'Error al obtener usuarios' });
        }
    }

    getOne = async (req, res) => {
        try {
            const { uid } = req.params;
            const userFound = await this.userService.getUser({ _id: uid });
            if (!userFound) {
                return res.status(404).send({ status: 'error', message: 'Usuario no encontrado' });
            }
            console.log('datos', userFound);
            res.send({ status: 'success', payload: userFound });
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: 'error', message: 'Error al obtener usuario' });
        }
    }

    getOneInfo = async (req, res) => {
        try {
            // Obtener el ID del parámetro de la ruta
            const userId = req.params.uid;
    
            if (!userId) {
                return res.status(400).json({ status: 'error', message: 'ID de usuario no proporcionado' });
            }
    
            // Verifica si el ID es una cadena y tiene la longitud correcta
            if (typeof userId === 'string' && userId.length === 24) {
                const user = await userService.getOneInfo(userId); // Pasa el ID directamente
                if (!user) {
                    return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
                }
                res.json({ status: 'success', payload: user });
            } else {
                return res.status(400).json({ status: 'error', message: 'ID de usuario inválido' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: 'error', message: 'Error al obtener la información del usuario' });
        }
    }

    create = async (req, res) => {
        try {
            const { first_name, last_name, email, password, age } = req.body;
            if (!email || !password) return res.status(400).send({ status: 'error', message: 'Faltan campos' });
    
            const newUser = {
                first_name,
                last_name,
                email,
                fullname,
                password: createHash(password), // Hashear la contraseña
                age
            };
    
            console.log('Nuevo usuario DTO:', newUser); // Log del objeto UserDto
    
            const result = await this.userService.createUser(newUser);
            console.log('Usuario creado:', result); // Log del resultado de la creación del usuario
            res.status(200).send({ status: 'success', payload: result });
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: 'error', message: 'Error al crear usuario' });
        }
    }

    update = async (req, res) => {
        try {
            const { uid } = req.params;
            const { first_name, last_name, email, age, password, role } = req.body;
            
            if (!first_name && !last_name && !email && !age && !password && !role) {
                return res.status(400).send({ status: 'error', message: 'No hay campos para actualizar' });
            }

            const updatedUser = {};
            if (first_name) updatedUser.first_name = first_name;
            if (last_name) updatedUser.last_name = last_name;
            if (email) updatedUser.email = email;
            if (age) updatedUser.age = age;
            if (password) updatedUser.password = createHash(password);
            if (role) updatedUser.role = role;

            const result = await this.userService.updateUser(uid, updatedUser);
            res.send({ status: 'success', payload: result });
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: 'error', message: 'Error al actualizar usuario' });
        }
    }

    deleteData = async (req, res) => {
        try {
            const { uid } = req.params;
            const result = await this.userService.deleteUser(uid);
            res.send({ status: 'success', payload: result });
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: 'error', message: 'Error al eliminar usuario' });
        }
    }
}

export default UserController;