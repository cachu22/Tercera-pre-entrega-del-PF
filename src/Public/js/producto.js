// Definir la URL base de tu API
const apiUrl = 'http://localhost:8000';

$(document).ready(function() {
    // Función para agregar un producto al carrito
    function addToCart(productId) {
        console.log("Añadiendo producto al carrito:", productId);

        // Verifica si productId es válido
        if (!productId) {
            console.error('ID del producto inválido.');
            Swal.fire('Error', 'ID del producto inválido.', 'error');
            return;
        }

        // Obtener el ID del carrito del almacenamiento local
        const cartId = localStorage.getItem('cartId');
        console.log("ID del carrito:", cartId);
        
        if (!cartId) {
            console.error('No se encontró el ID del carrito.');
            Swal.fire('Error', 'Debes loguearte para añadir productos', 'error');
            return;
        }
        
        const data = {
            quantity: 1
        };
        console.log("Datos enviados:", data);
        
        $.ajax({
            url: `http://localhost:8000/api/cartsDB/${cartId}/product/${productId}`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                console.log("Respuesta del servidor:", response);
                
                if (response && response.status === 'success') {
                    Swal.fire('Éxito', 'Producto agregado al carrito', 'success');
                } else {
                    console.error('Error al agregar al carrito:', response);
                    Swal.fire('Error', 'No se pudo agregar el producto al carrito', 'error');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error al agregar al carrito:', textStatus, errorThrown);
                Swal.fire('Error', 'No se pudo agregar el producto al carrito', 'error');
            }
        });
    }

    // Obtener productos
    $.ajax({
        url: `${apiUrl}/api/mgProducts/products`,
        method: 'GET',
        success: function(data) {
            console.log('mgProducts front producto.js:', data);

            if (Array.isArray(data.payload.docs)) {
                data.payload.docs.forEach(function(product) {
                    const productCard = `
                        <div class="card-servicios">
                            <img src="${product.thumbnails}" alt="Imagen">
                            <p>${product.title}</p>
                            <p>Precio: ${product.price}</p>
                            <p>Descripción: ${product.description}</p>
                            <p>Stock: ${product.stock}</p>
                            <button class="add-to-cart-btn" data-product-id="${product._id}">Agregar al carrito</button>
                            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#productModal" data-product-id="${product._id}">Detalles</button>
                        </div>
                    `;
                    $('#product-container').append(productCard);
                });

                // Asignar el evento click a los botones "Agregar al carrito" en la vista de tarjetas
                $(document).on('click', '.add-to-cart-btn', function() {
                    console.log("Botón 'Agregar al carrito' clicado desde la tarjeta");
                    let productId = $(this).data('product-id');
                    addToCart(productId);
                });
                
                // Asignar el evento click a los botones en el modal
                $(document).on('click', '.btn-primary', function() {
                    let productId = $(this).data('product-id');
                    console.log("Button clicked. Product ID:", productId);

                // Asignar el evento click al botón "Agregar al carrito" en el modal
                $(document).on('click', '.add-to-cart-btn', function() {
                    let productId = $(this).data('product-id');
                    console.log("Botón 'Agregar al carrito' clicado en el modal. ID del producto:", productId);
                    addToCart(productId);
                });

                    $.ajax({
                        url: `${apiUrl}/api/mgProducts/${productId}`,
                        method: 'GET',
                        success: function(response) {
                            console.log("Product details received:", response);
                            if (response.status === 'success') {
                                let product = response.payload;
                                console.log("Product details:", product);
                                let modalBody = $('#productModal .modal-body');
                                modalBody.empty();

                                let productDetails = `
                                    <div class="card-servicios">
                                        <img src="${product.thumbnails}" alt="Imagen">
                                    </div>
                                    <div>
                                        <p>${product.title}</p>
                                        <p>Modelo: ${product.model}</p>
                                        <p>Precio: ${product.price}</p>
                                        <p>Descripción: ${product.description}</p>
                                        <p>Codigo: ${product.code}</p>
                                        <p>Categoria: ${product.category}</p>
                                        <p>Disponibilidad: ${product.availability}</p>
                                        <p>Stock: ${product.stock}</p>
                                        <p>ID: ${product.id}</p>
                                        <button class="add-to-cart-btn" data-product-id="${product.id}">Agregar al carrito</button>
                                    </div>`;
                                modalBody.html(productDetails);

                            } else {
                                console.error('Error al cargar el producto:', response.message);
                                Swal.fire('Error', 'No se pudo cargar el producto', 'error');
                            }
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.error('Error al cargar el producto:', textStatus, errorThrown);
                            Swal.fire('Error', 'No se pudo cargar el producto', 'error');
                        }
                    });
                });
            } else {
                console.error('data.payload.docs no es un array:', data.payload.docs);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error al obtener la configuración del puerto:', textStatus, errorThrown);
        }
    });

    
});