
const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const eventsRouter = require('./controllers/events')
const config = require('./utils/config')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

mongoose
  .connect(config.mongoUrl)
  .then( () => { 
    console.log('connected to database', config.mongoUrl) 
  })
  .catch( err => { 
    console.log(err) 
  }) 

mongoose.Promise = global.Promise

app.use(cors())
app.use(morgan('tiny'))
app.use(bodyParser.json({ limit: '10mb' }))
app.use(express.static('build'))
app.use(middleware.logger)
app.use(middleware.tokenExtractor)  

app.use('/api/events', eventsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)


app.use(middleware.error)

const server = http.createServer(app)


server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app, server
}
