import mongoose from "mongoose";
import { userModel } from "../models/users.models.js";

class UserDaoMongo {
  async get(query) {
    if (typeof query === 'string') {
      if (!mongoose.Types.ObjectId.isValid(query)) {
        throw new Error('Invalid user ID');
      }
      return userModel.findOne({ _id: query });
    }
    return userModel.findOne(query);
  }

  async getOne(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid user ID');
    }
    return userModel.findOne({ _id: id });
  }

//   async getOneInfo(id) {
//     // Log el ID recibido
//     console.log('Buscando usuario con ID:', id);

//     // Asegúrate de que el ID sea una cadena y no contenga caracteres no válidos
//     if (typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
//         console.error('ID inválido:', id);
//         throw new Error('Invalid user ID');
//     }

//     try {
//         // Convierte el ID a un ObjectId antes de la búsqueda
//         const objectId = new mongoose.Types.ObjectId(id);
//         const user = await userModel.findOne({ _id: objectId }).exec();

//         // Log el usuario encontrado
//         console.log('Usuario encontrado:', user);

//         return user;
//     } catch (error) {
//         // Log el error
//         console.error('Error al buscar usuario:', error);
//         throw error;
//     }
// }

  getOneInfo = async (filter) => {
    try {
        return await this.collection.findOne(filter);
    } catch (error) {
        throw new Error('Error fetching user: ' + error.message);
    }
}

  async getAll() {
    return userModel.find();
  }

  async create(user) {
    try {
        // Log para verificar el objeto antes de guardarlo en la base de datos
        console.log('Objeto que se guarda en la base de datos:', user);
        const newUser = await userModel.create(user);
        return newUser;
    } catch (error) {
        console.error('Error al crear el usuario en la base de datos:', error);
        throw error;
    }
}

  async update(id, userData) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid user ID');
    }
    return userModel.updateOne({ _id: id }, { $set: userData });
  }

  async deleteData(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid user ID');
    }
    return userModel.deleteOne({ _id: id });
  }
}

export default UserDaoMongo