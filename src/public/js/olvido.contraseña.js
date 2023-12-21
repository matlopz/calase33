document.addEventListener('DOMContentLoaded', function () {
  const forgotPasswordForm = document.getElementById('forgotPasswordForm');
  const responseForgotPassword = document.getElementById('responseForgotPassword');

  forgotPasswordForm.addEventListener('submit', async e => {
    try {
      e.preventDefault();

      const data = {};
      const formData = new FormData(forgotPasswordForm);

      formData.forEach((value, key) => (data[key] = value));

      const headers = {
        'Content-Type': 'application/json',
      };
      const method = 'POST';
      const body = JSON.stringify(data);

      const response = await fetch('/forgot-password', {
        headers,
        method,

        body,
      });

      const result = await response.json();
      responseForgotPassword.innerText = result.message;
      const token = result.token
      localStorage.setItem('authToken', token.token)
    } catch (error) {
      console.log(error);
      responseForgotPassword.innerText = `Tenemos un error: ${error.error}`;
    }
  });
});
