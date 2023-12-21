const MailAdapter = require('../adapters/mail.adapters');

class MessageRepository {
    constructor(messageAdapter) {
        this.messageAdapter = new MailAdapter()
        console.log('que tiene mmesageAdap', messageAdapter)
    }

    async sendMessage(messageInfo) {
        await this.messageAdapter.sendMessage(messageInfo)
        console.log('que tiene mmesageAdap', this.messageAdapter)
    }
    async sendPasswordResetEmail(messageInfo) {
        await this.messageAdapter.sendPasswordResetEmail(messageInfo);
    }

}
module.exports = MessageRepository;
