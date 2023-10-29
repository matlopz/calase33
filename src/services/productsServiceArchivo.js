// services/productsService.js
const fs = require('fs');
const path = require('path');
const productsFilePath = path.join(__dirname, '../data/products.json');

// función para obtener el valor actual del contador desde el archivo
const getProductCounter = () => {
  const productsData = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
  const maxId = productsData.reduce((max, product) => Math.max(max, parseInt(product.id)), 0);
  return maxId;
};

let productCounter = getProductCounter();

const productsService = {
  getAllProducts() {
    return new Promise((resolve, reject) => {
      // agregar llamar al dao
      
      fs.readFile(productsFilePath, 'utf-8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(data));
        }
      });
    });
  },

  getProductById(pid) {
    return new Promise((resolve, reject) => {
      fs.readFile(productsFilePath, 'utf-8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          const productsData = JSON.parse(data);
          const product = productsData.find((product) => product.id === pid);
          resolve(product || null);
        }
      });
    });
  },

  addProduct(product) {
    return new Promise((resolve, reject) => {
      fs.readFile(productsFilePath, 'utf-8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          const productsData = JSON.parse(data);
          productCounter = getProductCounter(); // Actualizamos el contador antes de agregar un nuevo producto
          productCounter++;
          const newProduct = { ...product, id: productCounter.toString() };
          productsData.push(newProduct);
          fs.writeFile(productsFilePath, JSON.stringify(productsData, null, 2), 'utf-8', (err) => {
            if (err) {
              reject(err);
            } else {
              resolve(newProduct);
            }
          });
        }
      });
    });
  },

  updateProduct(pid, updatedProduct) {
    return new Promise((resolve, reject) => {
      fs.readFile(productsFilePath, 'utf-8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          const productsData = JSON.parse(data);
          const productIndex = productsData.findIndex((product) => product.id === pid);
          if (productIndex !== -1) {
            productsData[productIndex] = { ...productsData[productIndex], ...updatedProduct, id: pid };
            fs.writeFile(productsFilePath, JSON.stringify(productsData, null, 2), 'utf-8', (err) => {
              if (err) {
                reject(err);
              } else {
                resolve(productsData[productIndex]);
              }
            });
          } else {
            resolve(null);
          }
        }
      });
    });
  },

  deleteProduct(pid) {
    return new Promise((resolve, reject) => {
      fs.readFile(productsFilePath, 'utf-8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          const productsData = JSON.parse(data);
          const updatedProductsData = productsData.filter((product) => product.id !== pid);
          fs.writeFile(productsFilePath, JSON.stringify(updatedProductsData, null, 2), 'utf-8', (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        }
      });
    });
  },
};

module.exports = productsService;
