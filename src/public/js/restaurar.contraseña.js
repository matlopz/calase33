let authToken;

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

        const newPassword = resetPasswordForm.querySelector('input[name="newPassword"]').value;
        const authToken = getAuthToken();
        const body = JSON.stringify({
            newPassword: newPassword,
            resetToken: authToken,
        });
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        };

        const response = await fetch(`/reset-password/${resetToken}`, {
            headers,
            method: 'POST',
            body,
        });

        const result = await response.json();
        console.log('que tiene result', result);
        responseResetPassword.innerText = result.message;

        if (result.status === 'success') {
            // window.location.href = '/auth/login';
        }
    } catch (error) {
        console.log(error);
        responseResetPassword.innerText = `Tenemos un error: ${error.error}`;
    }
});
