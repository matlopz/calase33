const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');
const app = require('../src/app');
const api = supertest(app);


it('debería manejar la falta de correo electrónico en la solicitud de inicio de sesión', async function() {
    this.timeout(6000);
    const userData = {
      password: 'password123',
    };
  
    const response = await api
      .post('/auth/login')
      .send(userData)
      .set('Accept', 'application/json');
  
    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('status').that.equals('error');
    expect(response.body).to.have.property('error').that.equals('Missing email in the request');
  });


  
it('debería manejar la falta de contraseña en la solicitud de inicio de sesión', async function() {
    const userData = {
      email: 'user@example.com',
    };
  
    const response = await api
      .post('/auth/login')
      .send(userData)
      .set('Accept', 'application/json');
  
    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('status').that.equals('error');
    expect(response.body).to.have.property('error').that.equals('Missing password in the request');
  });

it('debería iniciar sesión de un usuario y devolver un token', async function() {
    
  const userData = {
    email: 'matias.lopez1@claro.com.ar',
    password: 'matias',
  };

  const response = await api
    .post('/auth/login')
    .send(userData)
    .set('Accept', 'application/json');

  expect(response.status).to.equal(200);
  expect(response.body).to.have.property('status').that.equals('success');
  expect(response.body).to.have.property('token').that.is.a('string');
});

it('debería manejar errores de inicio de sesión', async function() {
  const invalidUserData = {
    email: 'matlopez10@gmail.com',
    password: 'matias',
  };

  const response = await api
    .post('/auth/login')
    .send(invalidUserData)
    .set('Accept', 'application/json');

  expect(response.status).to.equal(401);
  expect(response.body).to.have.property('status').that.equals('error');
  expect(response.body).to.have.property('error').that.equals('Usuario no encontrado');
});




