const UserRepository = require('../repository/user-repository')
const jwt = require('jsonwebtoken')
const { JWT_KEY } = require('../config/configServer')
const bcrypt = require('bcrypt')
const AppErrors = require('../utils/error-handler')
class UserService {
  constructor() {
    this.userRepository = new UserRepository()
  }

  async create(data) {
    try {
      const user = await this.userRepository.create(data)
      return user
    } catch (error) {
      if (error.name == 'SequelizeValidationError') {
        throw error
      }
      console.log('Something went wrong in the service layer')
      throw error
    }
  }
  async signIn(email, plainPassword) {
    try {
      // step 1-> fetch the user using the email
      const user = await this.userRepository.getUserByEmail(email)
      // step 2-> compare incoming plain password with stores encrypted password
      const passwordsMatch = this.checkPassword(plainPassword, user.password)

      if (!passwordsMatch) {
        console.log("Password doesn't match")
        throw { error: 'Incorrect password' }
      }
      // step 3-> if passwords match then create a token and send it to the user
      const newJWT = this.createToken({ email: user.email, id: user.id })
      return newJWT
    } catch (error) {
      console.log('Something went wrong in the signIn process')
      throw error
    }
  }

  async isAuthenticated(token) {
    try {
      const isTokenVerified = this.verifyToken(token)
      if (!isTokenVerified) {
        throw { error: 'Invalid Token' }
      }
      const user = await this.userRepository.getById(isTokenVerified.id)
      if (!user) {
        throw { error: 'No user exist with this Token' }
      }
      return user
    } catch (error) {
      console.log('Something went wrong in the signIn process')
      throw error
    }
  }

  createToken(user) {
    try {
      const result = jwt.sign(user, JWT_KEY, { expiresIn: '1h' })
      return result
    } catch (error) {
      console.log('Something went wrong in the token creation')
      throw error
    }
  }

  verifyToken(token) {
    try {
      const response = jwt.verify(token, JWT_KEY)
      return response
    } catch (error) {
      console.log('Something went wrong in the token creation', error)
      throw error
    }
  }

  checkPassword(userInputPlainPassword, encryptedPassword) {
    try {
      return bcrypt.compareSync(userInputPlainPassword, encryptedPassword)
    } catch (error) {
      console.log('Something went wrong in the comparing password')
      throw error
    }
  }

  isAdmin(userId) {
    try {
      return this.userRepository.isAdmin(userId)
    } catch (error) {
      console.log('Something went wrong in the service layer')
      throw error
    }
  }
}

module.exports = UserService
