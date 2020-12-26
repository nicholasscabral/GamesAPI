const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mysql = require('mysql')
const dotenv = require('dotenv')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Promise = require('bluebird')

dotenv.config({ path: './.env' })

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
})

db.connect( (err) => {
  if (err) console.log(err)
  else console.log('DATABASE CONNECTED')
})

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors())

function auth(req, res, next) {
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

const getQueryRes = async (query) => new Promise((resolve, reject) => {
  db.query(query, (err, res) => {
    if (err) reject(err)
    else resolve(res)
  })
})

app.get('/games', auth, (req, res) => {
  db.query('SELECT * FROM games', (err, result) => {
    if ( err ) res.status(404).send("nenhum jogo encontrado")
    else return res.status(200).send({ user:req.loggedUser, games:result})
  })
})

app.get('/game/:id', (req, res) => {
  
  const id = req.params.id //validando dados

  if (isNaN(id)) res.sendStatus(400)
  else {
    
    db.query('SELECT * FROM games WHERE id = ?', id, (err, results) => {

      if (err) {
        console.log(err)
        res.sendStatus(500)
      }
      else if (results.length == 0) return res.status(404).send("JOGO NAO ENCONTRADO")
        else return res.status(200).send(results)
      
    })
  }
})

app.post('/game', (req, res) => {

  const { title, price, year } = req.body

  db.query('INSERT INTO games SET ?', {title: title, price: price, year: year}, (err, result) => {
    if (err) {
      console.log(err)
      res.sendStatus(400)
    }
    else {
      console.log(result)
      return res.status(200).send("JOGO CADASTRADO")
    }
  })
})

app.post('/delete-game/:id', (req, res) => {

  const id = req.params.id

  if (isNaN(id)) return res.status(400)
  else {
    db.query('DELETE FROM games WHERE id = ?', id, (err, result) => {
      if (err) return res.status(404).send({
        success: false
      })
      else return res.status(200).send({
        success: true
      })
    })
  }
})

app.post('/update-game/:id', (req, res) => {

  const id = req.params.id
  const { title, price, year } = req.body
  const defaultQuery = 'UPDATE games SET '
  let query = defaultQuery
  const queryData = []

  if (title) {
    query += 'title=?, '
    queryData.push(title)
  }
  
  if (price) {
    query += 'price=?, '
    queryData.push(price)
  }

  if (year) {
    query += 'year=?, '
    queryData.push(year)
  }

  if (query === defaultQuery) res.sendStatus(500)
  else {
    query = query.trim()
    query = query.slice(0, query.length - 1)
    query = query + ' WHERE id=?'
    queryData.push(id)

    db.query(query, queryData, (err, result) => {
      if (err) {
        console.log(err)
        res.sendStatus(400)
      }
      else {
        console.log(result)
        return res.status(200).send("DADOS ATUALIZADOS")
      }
    })
  }
})

app.post('/register', async (req, res) => {
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
})

app.post('/auth', async (req, res) => {
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
})

app.listen(4321, () => {
  console.log("API running...")
}) 