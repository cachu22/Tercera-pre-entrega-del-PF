// Definir la URL base de tu API
const apiUrl = 'http://localhost:8000';  

// Obtener el token del almacenamiento local
// const token = localStorage.getItem('token');

const token = generateToken({ id: user._id });


$.ajax({
    url: '/api/sessions/login',
    method: 'POST',
    data: { email, password },
    success: function(response) {
        if (response.status === 'success') {
            // Almacenar el token en el local storage
            localStorage.setItem('token', response.token);
            
            // Redirigir a la raíz de la web
            window.location.href = '/';
        } else {
            alert('Error: ' + response.error);
        }
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.error('Error en el login:', textStatus, errorThrown);
        alert('Error en el login: ' + textStatus);
    }
});
  
// Función para crear un carrito
function createCart() {
    $.ajax({
        url: `${apiUrl}/api/cartsDB`,
        method: 'POST',
        contentType: 'application/json',
        success: function(response) {
            console.log('Respuesta del servidor:', response);
            if (response && response.payload && response.payload.id) {
                // Guarda el ID del carrito en el almacenamiento local
                localStorage.setItem('cartId', response.payload.id);
                console.log("Carrito creado con ID:", response.payload.id);
            } else {
                console.error('Error al crear el carrito:', response);
                Swal.fire('Error', 'No se pudo crear el carrito', 'error');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error al crear el carrito:', textStatus, errorThrown);
            Swal.fire('Error', 'No se pudo crear el carrito', 'error');
        }
    });
}

// Crear un carrito en caso de que no exista
if (!localStorage.getItem('cartId')) {
    createCart();
}