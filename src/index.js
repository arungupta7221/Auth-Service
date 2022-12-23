const express = require('express')
const App = express()
const { PORT } = require('./config/configServer')
const prepareAndStartServer = () => {
  App.listen(PORT, () => {
    console.log(`Server has started on port : ${PORT}`)
  })
}

prepareAndStartServer()
