const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../database/db')
const getQueryRes = require('../helpers/getQueryRes')

async function registerUser(req, res) {
  const {username, email, password, passwordConf} = req.body

  if (!username || !email || !password) {
    return res.status(400).send({ message: 'Invalid credencials'})
  }

  if (password != passwordConf) {
    return res.status(400).send({ message: 'passwords do not match'})
  }

  const hashedPassword = await bcrypt.hash(password, 8)

  db.query('INSERT INTO users SET ?', { username: username, email: email, password: hashedPassword }, (err, result) => {
    if (err) return res.status(500).send(err)
    else return res.status(200).send({ message: 'Success'})
  })
}

async function authUser(req, res) {
  const { email, password } = req.body
  
  if (email != undefined) {
    var result = await getQueryRes(`SELECT * FROM users WHERE email = "${email}"`)
    
    if (result.length > 0) {
      console.log(result)
      var user = result[0]

      var passwordsMatches = await bcrypt.compare(password, user.password)

      if (passwordsMatches) {
        jwt.sign({id: user.id, email: user.email}, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN
        }, (err, token) => {
          if (err) res.status(500)
          else return res.status(200).send(token)
        })
      }
    } else {
      return res.status(404).send("no user found")
    }
  }
}

module.exports = {
  registerUser,
  authUser
}