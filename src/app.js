const express = require('express');
const cors = require('cors')
const handlebars = require('express-handlebars');
const MongoConnection = require('./db');
const cookieParser = require('cookie-parser');
const passport = require('passport')
const initializedPassport = require('./config/passport.config');
const logger = require('./middlewares/logger.middleware');
const router = require('./router')();
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')


const app = express();

app.use(cookieParser())
const hbs = handlebars.create({

    allowProtoPropertiesByDefault: true
});
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación de nuestra app mostrar los Productos',
            description:
                'Documentación que muestra todos los Productos del cliente',
        },
    },
    apis: [`${__dirname}/docs/**/*.yaml`],
}

const spec = swaggerJSDoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec))

app.use(cors());

app.use(express.json());
app.use(logger)
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.engine('handlebars', hbs.engine);
app.engine('handlebars', handlebars.engine({

    runtimeOptions: {

        allowProtoPropertiesByDefault: true,

    },

}))
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

initializedPassport()
app.use(passport.initialize())
MongoConnection.getInstance()


app.use('/', router);

module.exports = app;
