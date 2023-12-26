const mongoose = require('mongoose')
const appConfig = require('../config/index');
const mongoDB = appConfig.mongoDB
class MongoConnection {
    static #instance
    

    constructor() {
        this.connect()
    }

    async connect() {
        try {
            await mongoose.connect(`${mongoDB}`)
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
