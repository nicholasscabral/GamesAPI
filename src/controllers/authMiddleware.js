const jwt = require('jsonwebtoken')

function authMiddleware(req, res, next) {
  const authToken = req.headers['authorization']

  if (authToken !== undefined) {

    const bearer = authToken.split(' ')
    var token = bearer[1]

    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
      if (err) return res.status(401).send({ message: "Invalid Token"})
      else {

        req.token = token
        req.loggedUser = {id: data.id, email: data.email}
        next()

      }
    })
  } else {
    return res.staus(401).send({ message: "Invalid Token"})
  }
}

module.exports = authMiddleware