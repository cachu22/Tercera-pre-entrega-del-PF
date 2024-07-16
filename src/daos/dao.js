export class DaoMongo {
    constructor(model){
        this.model = model;
    }

    getAll = async () => {
        try {
            return await this.model.find({});
        } catch (error) {
            throw new Error('Error al obtener todos los documentos: ' + error.message);
        }
    }

    get = async (filter) => {
        try {
            return await this.model.findOne(filter);
        } catch (error) {
            throw new Error('Error al obtener el documento: ' + error.message);
        }
    }

    create = async (document) => {
        try {
            return await this.model.create(document);
        } catch (error) {
            throw new Error('Error al crear el documento: ' + error.message);
        }
    }

    update = async (filter, updateData) => {
        try {
            return await this.model.findOneAndUpdate(filter, updateData, { new: true });
        } catch (error) {
            throw new Error('Error al actualizar el documento: ' + error.message);
        }
    }

    delete = async (filter) => {
        try {
            return await this.model.findOneAndDelete(filter);
        } catch (error) {
            throw new Error('Error al eliminar el documento: ' + error.message);
        }
    }
}