const attachmentRouter = require('express').Router()
const Eventti = require('../models/eventti')
const Attachment = require('../models/attachment')

attachmentRouter.get('/', async (request, response) => {
    const attachments = await Attachment
        .find({})
        .populate('eventti', { _id: 1, title: 1, content: 1 })
    response.json(events.map(Attachment.format))
})

attachmentRouter.post('/', async (request, response) => {
    console.log("attachmentin post metodissa")
    try {
        console.log("try:")
        const body = request.body

        if (body.url === undefined) {
            return response.status(400).json({ error: 'url is missing' })
        }

        /* const eventti puuttuu... se saadaan miten? */

        const attachment = new Attachment({
            caption: body.caption,
            url: body.url,
            eventti: eventti._id
        })

        const savedAttachment = await attachment.save()

        eventti.attachments = eventti.attachments.concat(savedAttachment._id)
        await eventti.save()

        response.json(Attachment.format(savedAttachment))

    } catch (exception) {
        console.log("catch:")
        console.log(exception)
        response.status(500).json({ error: 'something went wrong...' })
    }
})

module.exports = attachmentRouter