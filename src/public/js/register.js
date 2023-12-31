const registerForm = document.getElementById('registerForm');
const responseRegister = document.getElementById('responseRegister');

registerForm.addEventListener('submit', async (e) => {
  try {
    e.preventDefault();

    const data = {};
    const formData = new FormData(registerForm);

    formData.forEach((value, key) => (data[key] = value));

    const response = await fetch('/auth/register', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(data),
    });

    const newUserResponse = await response.json();
    console.log('New User Tiene::', newUserResponse, newUserResponse.newUser)

    if (newUserResponse && newUserResponse.payload) {
      responseRegister.innerText = `El Usuario se creo Correctamente`;
      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 6000);

    } else {
      responseRegister.innerText = 'La respuesta del servidor es inválida o no contiene _id o cartId.';
    }

  } catch (error) {
    responseRegister.innerText = `Tenemos un error ${error}`;
  }
});
