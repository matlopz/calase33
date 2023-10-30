const {faker} = require("@faker-js/faker");

const generateProducts = numProduct => {
  const products = [];
  for (let i = 0; i < numProduct; i++) {
    products.push(generateProduct());
  }
  return products;
}

const generateProduct = () => {
  return {
    _id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    price: faker.commerce.price(),
    description: faker.commerce.productDescription(),
    code: faker.string.numeric({ min: 100, max: 599 }), 
    status: faker.datatype.boolean(), 
    stock: faker.string.numeric({length:2,exclude:['0']}),
    category: faker.commerce.department(),
    thumbnails: faker.image.imageUrl(),
  };
}

module.exports = generateProducts;
