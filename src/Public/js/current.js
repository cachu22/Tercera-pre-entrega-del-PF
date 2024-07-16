// Definir la URL base de tu API
const apiUrl = 'http://localhost:8000'; 

// Llamar a getUserInfo para obtener la información del usuario si ya está logueado
getUserInfo();

function getUserInfo() {
    const token = localStorage.getItem('token');

    if (!token) {
        console.warn('No token found');
        return;
    }

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
}