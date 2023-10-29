require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV,
    userMail:process.env.USER_MAIL,
    passwordMail: process.env.PASSWORD_MAIL,
    twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
    twilioSmsNumber: process.env.TWILIO_SMS_NUMBER,
    
}
