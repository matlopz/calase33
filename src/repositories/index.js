const MessageRepository = require("./message.repository");
const MessageAdapter = require('../adapters/factory')



const messageRepository = new MessageRepository(MessageAdapter)

module.exports = {
    messageRepository,
    
}
