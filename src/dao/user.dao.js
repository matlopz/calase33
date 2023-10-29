const User = require('../models/user')
const Message = require('../models/message')

class UsersDao {

    async findAll(){
       const user =  await User.find()
       return user;
    }
    async findOne(){
    const userFindOne =   await User.findOne({username: data.user})
    return userFindOne
    }
    async populate(){
        const message = await Message.find().populate('user');
        return message

    }
    
}
module.exports = UsersDao