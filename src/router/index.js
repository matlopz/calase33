// router/index.js
const express = require('express');
const RelatimeController = require('../controller/productsRealTimeController');
const cartsController = require('../controller/cartsController');
const productsController = require('../controller/productsController')
const usersController = require('../controller/controllerUsers');
const viewsController = require('../controller/views.Controller')
const authController = require('../controller/controller.auth')

const router = express.Router();
router.use('/users', usersController)
router.use('/productos', productsController);
router.use('/realTimeProducts', RelatimeController);
router.use('/carts', cartsController);
router.use('/views', viewsController)
router.use('/auth', authController)



 


module.exports = () => router;
