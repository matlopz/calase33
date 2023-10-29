const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const productColection = 'Product'

const prductSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    price: Number,
    description: String,
    code: String, 
    status: Boolean,
    stock: String,
    category: String,
    thumbnails: String,
   
})
prductSchema.plugin(mongoosePaginate)

const Products = mongoose.model(productColection, prductSchema)
module.exports = Products