const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    passwordHash: String
})

userSchema.statics.format = (user) => {
    return {
        id: user._id,
        name: user.name,
        username: user.username,       
    }
}

const User = mongoose.model('User', userSchema)

module.exports = User