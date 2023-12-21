const { winstonlogger, productionLogger } = require('../utils/winston');

const logger = (req, res, next) => {

    const selectedLogger = process.env.NODE_ENV === 'prod' ? productionLogger : winstonlogger;

    req.logger = selectedLogger;
    res.logger = selectedLogger;

    next();
};

module.exports = logger;
