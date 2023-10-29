const twilio = require('twilio')
const { twilioAccountSid, twilioAuthToken } = require('../config')

const client = twilio(twilioAccountSid,twilioAuthToken)

module.exports = client