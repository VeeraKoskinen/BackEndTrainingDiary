const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    passwordHash: String,
    events: [{type: mongoose.Schema.Types.ObjectId, ref: 'Eventti' }]
})

userSchema.statics.format = (user) => {
    return {
        id: user._id,
        name: user.name,
        username: user.username,
        events: user.events      
    }
}

const User = mongoose.model('User', userSchema)

module.exports = User