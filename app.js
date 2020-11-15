const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mysql = require('mysql')
const dotenv = require('dotenv')

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

app.get('/games', (req, res) => {
  db.query('SELECT * FROM games', (err, result) => {
    if ( err ) res.status(404).send("nenhum jogo encontrado")
    else return res.status(200).send(result)
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

app.delete('/game/:id', (req, res) => {

  const id = req.params.id

  if (isNaN(id)) res.sendStatus(400)
  else {
    db.query("SELECT * FROM games WHERE id = ?", id, (err, result) => {
      if (err) res.sendStatus(500)
      else if (result.length === 0) return res.status(404).send("GAME NOT FOUND")
        else {
          db.query("DELETE FROM games WHERE id = ?", id, (err, result) => {
            if (err) res.sendStatus(500)
            else res.status(200).send("GAME DELETED ")
          })
        }
    })
  }
})

app.listen(4321, () => {
  console.log("API running...")
})