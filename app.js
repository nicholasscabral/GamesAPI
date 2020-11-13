const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mysql = require('mysql')

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

app.listen(4321, () => {
  console.log("API running...")
})