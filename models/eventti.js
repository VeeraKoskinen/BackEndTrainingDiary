const mongoose = require('mongoose')

const eventtiSchema = new mongoose.Schema({
    title: String,
    content: String
})

eventtiSchema.statics.format = (eventti) => {
    return {
        id: eventti._id,
        title: eventti.title,
        content: eventti.content,               
    }
}

const Eventti = mongoose.model('Eventti', eventtiSchema);

module.exports = Eventti