const nodmailer = require('nodemailer')

const transport = nodmailer.createTransport({
    service:'gmail',
    port:587,
    auth:{
        user: 'matlopez10@gmail.com',
        pass: 'lksg pcoy nocd cfqa',
    }
})

module.exports = transport