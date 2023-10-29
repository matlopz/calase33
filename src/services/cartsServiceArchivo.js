// services/cartsService.js
const HTTP_STATUS_CODE = require('../constants/error.constants');
const fs = require('fs');
const path = require('path');
//agrego el productsService para controlar si existe el producto
const productsService = require('./productsServiceArchivo');
const cartsFilePath = path.join(__dirname, '../data/carts.json');



const cartsService = {
  getAllCarts() {
    return new Promise((resolve, reject) => {
      fs.readFile(cartsFilePath, 'utf-8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(data));
        }
      });
    });
  },

  createCart() {
    return new Promise((resolve, reject) => {
      fs.readFile(cartsFilePath, 'utf-8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          const cartsData = JSON.parse(data);
          const maxId = cartsData.reduce((max, cart) => Math.max(max, parseInt(cart.id)), 0);
          const newCartId = (maxId + 1).toString();
          const newCart = { id: newCartId, products: [] };
          cartsData.push(newCart);
          fs.writeFile(cartsFilePath, JSON.stringify(cartsData, null, 2), 'utf-8', (err) => {
            if (err) {
              reject(err);
            } else {
              resolve(newCart);
            }
          });
        }
      });
    });
  },

  getCartProducts(cid) {
    return new Promise((resolve, reject) => {
      fs.readFile(cartsFilePath, 'utf-8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          const cartsData = JSON.parse(data);
          const cart = cartsData.find((cart) => cart.id === cid);
          resolve(cart ? cart.products : null);
        }
      });
    });
  },

  addProductToCart(cid, pid, quantity) {
    return new Promise((resolve, reject) => {
      fs.readFile(cartsFilePath, 'utf-8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          const cartsData = JSON.parse(data);
          const cartIndex = cartsData.findIndex((cart) => cart.id === cid);
  
          if (cartIndex === -1) {
            resolve({ error: 'El carrito no existe' });
            return;
          }
  
          // Verificar si el producto existe en products.json
          productsService.getProductById(pid).then((product) => {
            if (!product) {
              resolve({ error: 'El producto no existe', statusCode: HTTP_STATUS_CODE.NOT_FOUND });
              return;
            }
  
            const cart = cartsData[cartIndex];
            const existingProduct = cart.products.find((item) => item.product === pid);
  
            let newProduct = null; // Declarar newProduct aquí
  
            if (existingProduct) {
              // Si el producto ya existe en el carrito, actualizamos la cantidad
              existingProduct.quantity += quantity;
            } else {
              // Si el producto no está en el carrito, lo agregamos como nuevo elemento
              newProduct = { product: pid, quantity }; // Asignar el valor del nuevo producto
              cart.products.push(newProduct);
            }
  
            fs.writeFile(cartsFilePath, JSON.stringify(cartsData, null, 2), 'utf-8', (err) => {
              if (err) {
                reject(err);
              } else {
                resolve(existingProduct || newProduct);
              }
            });
          });
        }
      });
    });
  }
  
  
};

module.exports = cartsService;
