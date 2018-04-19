const mongoose = require('mongoose')

const eventtiSchema = new mongoose.Schema({
    title: String,
    content: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

eventtiSchema.statics.format = (eventti) => {
    return {
        id: eventti._id,
        title: eventti.title,
        content: eventti.content,
        user: eventti.user           
    }
}

const Eventti = mongoose.model('Eventti', eventtiSchema);

module.exports = Eventti