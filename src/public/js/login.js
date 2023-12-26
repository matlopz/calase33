const loginForm = document.getElementById('loginForm')
const responseLogin = document.getElementById('responseLogin')

loginForm.addEventListener('submit', async e => {
  try {
    e.preventDefault()

    const data = {}
    const formData = new FormData(loginForm)

    formData.forEach((value, key) => (data[key] = value))

    const headers = {

      'Content-Type': 'application/json',

    }
    const method = 'POST'
    const body = JSON.stringify(data)

    const response = await fetch('/auth/login', {
      headers,
      method,
      body,
    })

    const newSession = await response.json()


    const token = newSession.token
    const user = newSession.user.role
    localStorage.setItem('authToken', token)

    if (newSession.status === 'success') {
      console.log('Inicio de sesión exitoso');
      if (user !== 'premium') {
        window.location.href = '/views/productos';
      } else {
        window.location.href = '/realTimeProducts';
      }

    } else {
      console.log('Error en el inicio de sesión');
    }

    responseLogin.innerText = `${newSession.payload}`
  } catch (error) {
    responseLogin.innerText = `Tenemos un error ${error.error}`
  }
  githubLoginButton.addEventListener('submite', () => {
    window.location.href = '/auth/github'; 
  });
})
