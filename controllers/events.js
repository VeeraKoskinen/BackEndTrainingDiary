const eventsRouter = require('express').Router()
const Eventti = require('../models/eventti')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

eventsRouter.get('/', async (request, response) => {
    const events = await Eventti
      .find({})
    response.json(events.map(Eventti.format))
})


eventsRouter.post('/', async (request, response) => {

    try {
      const body = request.body
  
      if (body.title === undefined) {
        return response.status(400).json({ error: 'title is missing' })
      }
  
      const eventti = new Eventti ({
        title: body.title,
        content: body.content
      })
  
      const savedEventti = await eventti.save()

  
      response.json(Eventti.format(savedEventti))
  
    } catch (exception) {
        console.log(exception)
        response.status(500).json({ error: 'something went wrong...' })
  
    }
  
})

module.exports = eventsRouter
