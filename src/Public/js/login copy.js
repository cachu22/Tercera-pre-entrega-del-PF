// Definir la URL base de tu API
const apiUrl = 'http://localhost:8000';  

// Obtener el token del almacenamiento local
const token = localStorage.getItem('token');

// Realizar una solicitud protegida con el token
$.ajax({
    url: `${apiUrl}/api/usersDB/user-info`,
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}` // Enviar el token en el encabezado
    },
    success: function(userData) {
        if (userData && userData.status === 'success' && userData.payload) {
            console.log('Datos del usuario obtenidos:', userData.payload);
            const isLoggedIn = true;
            // Aquí va el resto del código para obtener productos y generar tarjetas
        } else {
            console.warn('Usuario no está logueado o datos no válidos:', userData);
            const isLoggedIn = false;
            // Mostrar mensaje o ajustar la vista según sea necesario
        }
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.error('Error al obtener datos del usuario:', textStatus, errorThrown);
        console.log('Respuesta completa del error:', jqXHR.responseText);
    }
});

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