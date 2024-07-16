// Definir la URL base de tu API
const apiUrl = 'http://localhost:8000';

$(document).ready(function() {

    // // Función para crear un carrito
    // function createCart() {
    //     $.ajax({
    //         url: `${apiUrl}/api/cartsDB`,
    //         method: 'POST',
    //         contentType: 'application/json',
    //         success: function(response) {
    //             console.log('Respuesta del servidor:', response);
    //             if (response && response.payload && response.payload.id) {
    //                 // Guarda el ID del carrito en el almacenamiento local
    //                 localStorage.setItem('cartId', response.payload.id);
    //                 console.log("Carrito creado con ID:", response.payload.id);
    //             } else {
    //                 console.error('Error al crear el carrito:', response);
    //                 Swal.fire('Error', 'No se pudo crear el carrito', 'error');
    //             }
    //         },
    //         error: function(jqXHR, textStatus, errorThrown) {
    //             console.error('Error al crear el carrito:', textStatus, errorThrown);
    //             Swal.fire('Error', 'No se pudo crear el carrito', 'error');
    //         }
    //     });
    // }

    // // Función para agregar un producto al carrito
    function addToCart(productId) {
        console.log("Añadiendo producto al carrito:", productId);
        
        // Obtener el ID del carrito del almacenamiento local
        const cartId = localStorage.getItem('cartId');
        console.log("ID del carrito:", cartId); // Depuración
        
        if (!cartId) {
            console.error('No se encontró el ID del carrito.');
            Swal.fire('Error', 'No se encontró el ID del carrito', 'error');
            return;
        }
        
        const data = {
            quantity: 1
        };
        console.log("Datos enviados:", data); // Depuración
        
        $.ajax({
            url: `${apiUrl}/api/cartsDB/${cartId}/product/${productId}`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                console.log("Respuesta del servidor:", response); // Depuración
                
                // Manejar la respuesta según el status
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

            // Comprobar si data.payload.docs es un array
            if (Array.isArray(data.payload.docs)) {
                data.payload.docs.forEach(function(product) {
                    // Crear el HTML de la card del producto
                    const productCard = `
                        <div class="card-servicios">
                            <img src="${product.thumbnails}" alt="Imagen">
                            <p>${product.title}</p>
                            <p>Precio: ${product.price}</p>
                            <p>Descripción: ${product.description}</p>
                            <p>Stock: ${product.stock}</p>
                            <button class="add-to-cart-btn" data-product-id="${product._id}" onclick="window.location.href='/login'">Loguearse para comprar</button>
                            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#productModal" data-product-id="${product._id}">Detalles</button>
                        </div>
                    `;
                    // Insertar la card en el contenedor
                    $('#product-container').append(productCard);
                });

                // Asignar el evento click a los botones de detalles después de que el DOM esté listo
                $('.btn-primary').on('click', function() {
                    let productId = $(this).data('product-id');
                    console.log("Button clicked. Product ID:", productId);

                    // Realizar una solicitud AJAX para obtener los detalles del producto
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
                                        <button class="add-to-cart-btn" data-product-id="${product._id}">Agregar al carrito</button>
                                    </div>`;
                                modalBody.html(productDetails);

                                // Asignar el evento click al botón "Agregar al carrito" en el modal
                                modalBody.find('.add-to-cart-btn').on('click', function() {
                                    let productId = $(this).data('product-id');
                                    addToCart(productId);
                                });
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

                // Asignar el evento click a los botones "Agregar al carrito" en la vista de tarjetas
                $('.add-to-cart-btn').on('click', function() {
                    console.log("Botón 'Agregar al carrito' clicado");
                    let productId = $(this).data('product-id');
                    addToCart(productId);
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