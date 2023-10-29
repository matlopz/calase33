const mongoose = require('mongoose')
class MongoConnection {
    static #instance

    constructor() {
        this.connect()
    }

    async connect() {
        try {
            await mongoose.connect('mongodb+srv://matlopz:Dolo2018@product.n2gwuwa.mongodb.net/?retryWrites=true&w=majority')
            console.log('db conected')
        } catch (err) {
            console.log(err)
        }

    }
    static getInstance() {
        if (this.#instance) {
            return this.#instance
        }
        this.#instance = new MongoConnection()
        return this.#instance
    }
}
module.exports = MongoConnection
