const MessageRepository = require("./message.repository");
const MessageAdapter = require('../adapters/factory');
const CartRepository = require("./cartRepository");
const CartFactory = require("../factories/cartFactory");


const cartRepository = new CartRepository(CartFactory)
const messageRepository = new MessageRepository(MessageAdapter)

module.exports = {
    messageRepository,
    cartRepository,
}
