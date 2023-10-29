
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

    console.log('datos del back token: ',newSession)
    const token = newSession.token
    localStorage.setItem('authToken',token)
    console.log('que tiene local Storage: ',token)
    if (newSession.status === 'success') {
      console.log('Inicio de sesión exitoso');
     
     window.location.href = '/views/productos';
    } else {
      console.log('Error en el inicio de sesión');
    }
    


    responseLogin.innerText = `${newSession.payload}`
  } catch (error) {
    console.log(error)
    responseLogin.innerText = `Tenemos un error ${error.error}`
  }
})