const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  console.log("sisällä api reitissä")  
  const body = request.body

  const user = await User.findOne({ username: body.username })
  const passwordCorrect = user === null ?
    false :
    await bcrypt.compare(body.password, user.passwordHash)

  if ( !(user && passwordCorrect) ) {
    return response.status(401).send({ error: 'invalid username or password' })
  }

  const userForToken = {
    username: user.username,
    id: user._id
  }
  console.log("luodaaan token")
  const token = jwt.sign(userForToken, process.env.SECRET)
  console.log(token)

  response.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter