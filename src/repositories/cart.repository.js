import CartDto from "../dtos/carts.dto.js";

export default class CartRepository {
    constructor(cartDao) {
        this.cartDao = cartDao;
    }

    // Obtener todos los carritos
    getAll = async () => {
        const carts = await this.cartDao.getAll();
        return carts.map(cart => new CartDto(cart)); // Transforma los datos en DTOs
    };

    // Obtener un carrito por ID
    getById = async (id) => {
        const cart = await this.cartDao.getBy({ _id: id });
        return cart ? new CartDto(cart) : null; // Transforma el carrito en DTO
    };

    // Crear un nuevo carrito
    createCart = async (cart) => {
        // Crear el carrito en la base de datos
        const newCart = await this.cartDao.create(cart);
        console.log('log de cart.repository-create', newCart);
        
        // Transformar el carrito creado en un DTO y devolverlo
        return new CartDto(newCart);
    };

    // Agregar producto al carrito
    addProductToCart = async (cartId, productId, quantity) => {
        const updatedCart = await this.cartDao.addProductToCart(cartId, productId, quantity);
        return new CartDto(updatedCart); // Devuelve el carrito actualizado como DTO
    };

    // Actualizar la cantidad del producto en el carrito
    updateProductQuantity = async (cartId, productId, quantity) => {
        const updatedCart = await this.cartDao.updateProductQuantity(cartId, productId, quantity);
        return new CartDto(updatedCart); // Devuelve el carrito actualizado como DTO
    };

    // Eliminar producto del carrito
    removeProductFromCart = async (cartId, productId) => {
        const updatedCart = await this.cartDao.removeProduct(cartId, productId);
        return new CartDto(updatedCart); // Devuelve el carrito actualizado como DTO
    };

    // Vaciar el carrito
    emptyCart = async (cartId) => {
        const updatedCart = await this.cartDao.emptyCart(cartId);
        return new CartDto(updatedCart); // Devuelve el carrito vacío como DTO
    };
}