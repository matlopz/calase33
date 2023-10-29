const  environment  = require("../config/index");

switch (environment) {
    case 'dev':
        module.exports = require('../adapters/sms.adapters')
        break;

        case 'prod':
            module.exports = require('../adapters/mail.adapters')
            break;
}