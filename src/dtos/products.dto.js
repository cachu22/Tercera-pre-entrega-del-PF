export default class ProductDto {
    constructor(product) {
        if (!product) {
            throw new Error('Product data is required');
        }
        console.log('Generando DTO para producto:', product);
        this.id = product._id;
        this.title = product.title;
        this.model = product.model;
        this.price = product.price;
        this.description = product.description;
        this.code = product.code;
        this.category = product.category;
        this.availability = product.availability;
        this.stock = product.stock;
        this.thumbnails = product.thumbnails;
        this.createdAt = product.createdAt;
        this.updatedAt = product.updatedAt;
    }
}