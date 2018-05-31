const eventsRouter = require('express').Router()
const Eventti = require('../models/eventti')
const imgurRouter = require('./imgur')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

eventsRouter.get('/', async (request, response) => {
  console.log('eventsRouter, get')
  const events = await Eventti
    .find({})
    .populate('user', { _id: 1, username: 1, name: 1 })
  response.json(events.map(Eventti.format))
})

const modifyAttachments = (response) => {
  const attachments = []
  var counter = 0
  console.log('response')
  console.log(response)
  
  response.map( attachment => {
    var attachment = {
      id: counter,
      imgurId: attachment.id,
      url: attachment.link,
      deletehash: attachment.deletehash
    }
    
    attachments.push(attachment)
    counter = counter + 1
  })
  return attachments
}


eventsRouter.post('/', async (request, response) => {
  console.log("eventsRouter, post ")

  try {
    const body = request.body
    console.log("eventsRouter, post, try:")
    console.log('body: ', body)

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    
    if (body.title === undefined || body.title === "") {
      return response.status(400).json({ error: 'title is missing' })
    }
    const res = await imgurRouter.sendImagesToImgur(body.attachments)
    const attachmentsForThisEvent = modifyAttachments(res)
    console.log('afte: ', attachmentsForThisEvent)

    const user = await User.findById(decodedToken.id)

    const eventti = new Eventti({
      title: body.title,
      content: body.content,
      user: user._id,
      attachments: attachmentsForThisEvent
    })
   console.log('eventti ', eventti)
    const savedEventti = await eventti.save()

    user.events = user.events.concat(savedEventti._id)
    await user.save()


    response.json(Eventti.format(savedEventti))

  } catch (exception) {
    console.log("eventsRouter, post, catch:")
    if (exception.name === 'JsonWebTokenError') {
      response.status(401).json({ error: exception.message })
    } else {
      console.log(exception)
      response.status(500).json({ error: 'something went wrong...' })
    }
  }

})

eventsRouter.delete('/:id', async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    const eventti = await Eventti.findById(request.params.id)
    const user = await User.findById(decodedToken.id)

    if ( eventti.user.toString() !== user._id.toString() ){
      return response.status(401).json({ error: 'You do not have right to remove this item.' })
    }

    await Promise.all(eventti.attachments.map( attachment => {
      return imgurRouter.deleteImageFromImgur(attachment.deletehash)
    }))

    await Eventti.findByIdAndRemove(request.params.id)
    response.status(200).end()

  } catch (exception) {
    console.log("Catch, exception: ", exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

eventsRouter.put('/:id', async (request, response) => {

  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const body = request.body
    const user = await User.findById(decodedToken.id)
    
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (body.title === undefined || body.title === "") {
      return response.status(400).json({ error: 'title is missing' })
    }

    const newEventti = {
      title: body.title,
      content: body.content,
      user: user,
      attachments: body.attachments
    }

    const updatedEventti = await Eventti.findByIdAndUpdate(request.params.id, newEventti, {new: true })
    response.status(200).json(Eventti.format(updatedEventti))

  } catch (exception) {
    console.log("Catch: " ,exception)
    response.status(400).json({ error: 'mallformatted id' })
  }
})

module.exports = eventsRouter
