let authToken;

console.log('que tiene ', authToken);

const getAuthToken = () => {
    const authToken = localStorage.getItem('authToken');
    console.log('que tiene authToken', authToken);

    if (!authToken) {
        console.log('No se encontró un token de autorización en el almacenamiento local.');
        return null;
    }

    return authToken;
};

resetPasswordForm.addEventListener('submit', async e => {
    try {
        e.preventDefault();

        // Utiliza directamente authToken en lugar de crear una nueva variable
        

        const newPassword = resetPasswordForm.querySelector('input[name="newPassword"]').value;
        console.log('que tiene newPassword', newPassword);
        const authToken = getAuthToken();
        console.log('que tiene esta variable ',authToken)
        const body = JSON.stringify({
            newPassword: newPassword,
            resetToken: authToken,
        });
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        };
        console.log('que tiene body', body);

        const response = await fetch(`/reset-password/${resetToken}`, {
            headers,
            method: 'POST',
            body,
        });

        const result = await response.json();
        console.log('que tiene result', result);
        responseResetPassword.innerText = result.message;

        // Redirigir al usuario después de restablecer la contraseña si es exitoso
        if (result.status === 'success') {
            // window.location.href = '/auth/login';
        }
    } catch (error) {
        console.log(error);
        responseResetPassword.innerText = `Tenemos un error: ${error.error}`;
    }
});
