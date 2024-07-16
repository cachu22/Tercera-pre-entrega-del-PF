import fs from 'fs'
class CartDaoFS {
    constructor(path) {
        this.path = path
    }
    
     // Método para obtener todos los carritos
     getAllCarts() {
        const cartsData = this.getCartsFromFile();
        return cartsData.carts;
    }

    // Método para obtener los datos de los carritos desde el archivo
    getCartsFromFile() {
        const data = fs.readFileSync(this.path, 'utf8');
        return JSON.parse(data);
    }
    getCart = () => {}

    // Método para crear un nuevo carrito
    createCart = () => {
        // Generar un ID único para el nuevo carrito
        const newCartId = this.generateUniqueCartId();

    // Crear un nuevo carrito con el ID generado y una lista vacía de productos
    const newCart = {
        "id de carrito": newCartId,
        products: []
    };

    // Obtener los carritos existentes
    const carts = this.getCartsFromFile();

    // Agregar el nuevo carrito al array de carritos
    carts.push(newCart);

    // Guardar los cambios en el archivo carts.json
    this.saveCartsToFile(carts);

    return newCart;
}

    // Método para generar un ID único para el nuevo carrito
    generateUniqueCartId() {
        // Lógica para generar un ID único
        const carts = this.getCartsFromFile();
        const existingIds = carts.map(cart => cart["id de carrito"]);
        const newId = Math.max(...existingIds, 0) + 1; // Incrementar el ID más alto en 1
        return newId;
    }

    // Método para obtener un carrito por su ID
    getCartById(cartId) {
        // Leer el archivo JSON de carritos
        const cartsData = this.getCartsFromFile();

        // Buscar el carrito por su ID
        const cart = cartsData.find(cart => cart["id de carrito"] === cartId);

        // Retornar el carrito encontrado (o null si no se encuentra)
        return cart || null;
    }                        

    // Método para obtener los carritos desde el archivo
    getCartsFromFile() {
        if (!fs.existsSync(this.path)) {
            return []; // Si no existe el archivo, devuelve una lista vacía
        }
        const data = fs.readFileSync(this.path, 'utf8');
        if (!data.trim()) {
            return []; // Si el archivo está vacío, devuelve una lista vacía
        }
        return JSON.parse(data);
    }

    // Método para guardar los carritos en un archivo JSON
    saveCartsToFile(carts) {
        const cartsJSON = JSON.stringify(carts, null, 2);
        fs.writeFileSync(this.path, cartsJSON);
    }
    
    //Leer el json de productos para traer info
    getProductsFromFile = () => {
        try {
            const productsData = fs.readFileSync('./src/file/products.json', 'utf-8');
            return JSON.parse(productsData);
        } catch (error) {
            console.error('Error al leer el archivo de productos:', error);
            return [];
        }
    }

    // Método para agregar un producto al carrito
addProductToCart = async (cid, pid) => {
    try {
        // Obtener los carritos desde el archivo
        let carts = this.getCartsFromFile();

        // Obtener los productos desde el archivo
        let products = this.getProductsFromFile();

        // Buscar el producto por su ID
        const productToAdd = products.find(product => product.id === parseInt(pid));

        // Buscar el carrito por su ID
        let cartIndex = carts.findIndex(cart => cart["id de carrito"] === parseInt(cid));

        // Si no se encontró el carrito, crear uno nuevo
        if (cartIndex === -1) {
            const newCart = {
                "id de carrito": parseInt(cid),
                products: [{ "id de producto": pid, quantity: 1,
                thumbnails: productToAdd.thumbnails, // Agregar la imagen del producto
                price: productToAdd.price // Agregar el precio del producto
            }]
            };
            carts.push(newCart); // Agregar el nuevo carrito a la lista de carritos
        } else {
            // Si el carrito ya existe, buscar el producto por su ID
            const existingProductIndex = carts[cartIndex].products.findIndex(item => item["id de producto"] === pid);
            if (existingProductIndex !== -1) {
                // Si el producto ya está en el carrito, incrementar la cantidad
                carts[cartIndex].products[existingProductIndex].quantity++;
            } else {
                // Si el producto no está en el carrito, agregarlo con cantidad 1
                carts[cartIndex].products.push({ "id de producto": pid, quantity: 1,
                thumbnails: productToAdd.thumbnails, // Agregar la imagen del producto
                price: productToAdd.price // Agregar el precio del producto 
            });
        }
        }

        // Guardar los cambios en el archivo después de modificar el carrito
        this.saveCartsToFile(carts);

        return { message: 'Producto agregado al carrito correctamente', cart: carts[cartIndex] };
    } catch (error) {
        console.log(error);
        throw error;
    }
}
};

export default CartDaoFS;