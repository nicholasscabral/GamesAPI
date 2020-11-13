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

app.listen(4321, () => {
  console.log("API running...")
})