const express = require('express')
const bodyParser = require('body-parser')

const { PORT } = require('./config/configServer')
const apiRoutes = require('./routes/index')
const db = require('./models/index')
// const {User} = require('./models/index');
// const bcrypt = require('bcrypt');
// const UserService = require('./services/user-service')
const app = express()

const prepareAndStartServer = () => {
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  app.use('/api', apiRoutes)

  app.listen(PORT, async () => {
    console.log(`Server Started on Port: ${PORT}`)
    if (process.env.DB_SYNC) {
      db.sequelize.sync({ alter: true })
    }
    // const incomingpassword = '123456';
    // const user = await User.findByPk(3);
    // const response = bcrypt.compareSync(incomingpassword, user.password);
    // console.log(response);

    // const service = new UserService()
    // const newToken = service.createToken({ email: 'arun@gmail.com', id: 1 })
    // console.log('new token is ', newToken)

    // const token =
    //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFydW5AZ21haWwuY29tIiwiaWQiOjEsImlhdCI6MTY3MjA1NDgxNSwiZXhwIjoxNjcyMDU4NDE1fQ.HQSUV6XKhcGNgt-rUoVcc2C4VkgREof5Gw8g0fJeJ1c'
    // const response = service.verifyToken(token)
    // console.log(response)
  })
}
prepareAndStartServer()
