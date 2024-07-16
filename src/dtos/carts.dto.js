export default class CartDto {
    constructor(cart) {
        if (!cart) {
            throw new Error('Cart data is required');
        }
        this.id = cart._id;
        this.products = cart.products || [];
        this.createdAt = cart.createdAt;
        this.updatedAt = cart.updatedAt;
    }
}