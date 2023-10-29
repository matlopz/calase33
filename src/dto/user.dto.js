class UserDto{
    constructor(NewUser){
        this.name = NewUser.name
        this.lastname = NewUser.lastname
        this.age = NewUser.age
        this.email = NewUser.email
        this.number = NewUser.number
        this.password = NewUser.password
    }
}
module.exports = UserDto
