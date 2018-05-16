const mongoose = require('mongoose')

const attachmentSchema = new mongoose.Schema({
    caption: String,
    url: String,
    eventti: { type: mongoose.Schema.Types.ObjectId, ref: 'Eventti' }
})

attachmentSchema.statics.format = (attachment) => {
    return {
        id: attachment._id,
        caption: attachment.caption,
        url: attachment.url,
        eventti: attachment.eventti       
    }
}

const Attachment = mongoose.model('Attachment', attachmentSchema);

module.exports = Attachment