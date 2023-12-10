const Product = require('../models/products.models'); 
class ProductDAO {
  async getAllProducts() {
    try {
      const products = await Product.find();
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Error fetching products');
    }
  }

  async getProductById(productId) {
    try {
      const product = await Product.findById(productId);
      return product;
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw new Error('Error fetching product by ID');
    }
  }

  async addProduct(newProductData) {
    try {
      const newProduct = new Product(newProductData);
      await newProduct.save();
      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      throw new Error('Error adding product');
    }
  }

  async updateProduct(productId, updatedProductData) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(productId, updatedProductData, { new: true });
      if (!updatedProduct) {
        console.error('Product not found');
        throw new Error('Product not found');
      }
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error('Error updating product');
    }
  }

  async deleteProduct(productId) {
    try {
      const deletedProduct = await Product.findByIdAndDelete(productId);
      if (!deletedProduct) {
        console.error('Product not found');
        throw new Error('Product not found');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error('Error deleting product');
    }
  }
  
  async getProductsByQuery(queryParams) {
    const { limit = 10, page = 1, sort = 'asc', query = '' } = queryParams;
    const skip = (page - 1) * limit;

    const filter = {};
    if (query) {
      filter.title = { $regex: query, $options: 'i' };
    }

    const sortOptions = {};
    if (sort === 'asc' || sort === 'desc') {
      sortOptions.price = sort === 'asc' ? 1 : -1;
    }

    try {
      const products = await Product.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);
      return products;
    } catch (error) {
      console.error('Error fetching products by query:', error);
      throw new Error('Error fetching products by query');
    }
  }
}

module.exports = new ProductDAO();
