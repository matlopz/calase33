// router/index.js
const express = require('express');
const RelatimeController = require('../controller/productsRealTimeController');
const cartsController = require('../controller/cartsController');
const productsController = require('../controller/productsController')
const usersController = require('../controller/controllerUsers');
const viewsController = require('../controller/views.Controller')
const authController = require('../controller/controller.auth')
const mockingproductsController = require('../controller/mockingproducts.contrllers')
const forgotPasswordController = require('../controller/forgotPasswordController');
const resetPasswordController = require('../controller/resetPasswordController');



const router = express.Router();
router.use('/users', usersController)
router.use('/productos', productsController);
router.use('/realTimeProducts', RelatimeController);
router.use('/carts', cartsController);
router.use('/views', viewsController)
router.use('/auth', authController)
router.use('/mockingproducts',mockingproductsController)
router.use('/forgot-password', forgotPasswordController);
router.use('/reset-password', resetPasswordController); 
router.use('/',viewsController);

module.exports = () => router;
