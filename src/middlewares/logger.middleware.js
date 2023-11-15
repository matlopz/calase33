const {winstonlogger,productionLogger} = require('../utils/winston')

const logger =(req, res,next)=>{
    req.logger = productionLogger
    res.logger = productionLogger
    next()
}
module.exports = logger
