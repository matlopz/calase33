const { twilioSmsNumber } = require("../config");

class SmsAdapter{
    async sedMessages(messageInfo){
        await client.messages.create({
            body:`${messageInfo.name} Bienvenido a nuestro sitio!!!`,
            from:twilioSmsNumber,
            to: messageInfo.number,
          })
    }
}
module.exports = SmsAdapter