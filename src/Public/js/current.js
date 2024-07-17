// Definir la URL base de tu API
const apiUrl = 'http://localhost:8000';

function getUserInfo() {
    const token = localStorage.getItem('token');
    console.log('log de current.js - getUserInfo - token', token);

    if (!token) {
        console.warn('No token found');
        return;
    }

    // Decodificar el token JWT para obtener el ID del usuario
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.id;

    $.ajax({
        url: `${apiUrl}/api/usersDB/user-info/${userId}`, // Usar el ID del usuario en la URL
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}` // Enviar el token en el encabezado
        },
        success: function(userData) {
            if (userData && userData.status === 'success' && userData.payload) {
                console.log('Datos del usuario obtenidos:', userData.payload);
                const isLoggedIn = true;

                // Actualizar el contenido del HTML con los datos del usuario
                $('#user-fullname').text(userData.payload.fullname || 'Nombre no disponible');
                $('#user-email').text(userData.payload.email || 'Email no disponible');
                // Agrega más campos según sea necesario

            } else {
                console.warn('Usuario no está logueado o datos no válidos:', userData);
                const isLoggedIn = false;
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error al obtener datos del usuario:', textStatus, errorThrown);
            console.log('Respuesta completa del error:', jqXHR.responseText);
        }
    });
}

// Llamar a getUserInfo para obtener la información del usuario si ya está logueado
getUserInfo();