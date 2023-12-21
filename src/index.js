const appConfig = require('./config/index');
const initializeIO = require('./io');
const app = require('./app');
const port = appConfig.port;
const httpServer = app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});

initializeIO(httpServer)

