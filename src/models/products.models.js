const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productCollection = 'Product';

const productSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: String,
  price: Number,
  description: String,
  code: String,
  status: Boolean,
  stock: String,
  category: String,
  thumbnails: String,
  owner: String,
});

productSchema.plugin(mongoosePaginate);

const Products = mongoose.model(productCollection, productSchema);

module.exports = Products;
