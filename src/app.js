// Import dependencies
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')

// Import Routes/Middleware
const authMiddleware = require('./controllers/authMiddleware')
const gameRoutes = require('./routes/games')
const userRoutes = require('./routes/users')

// Configs
dotenv.config({ path: './.env' })
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors())

// Games routes
app.get('/games', authMiddleware, gameRoutes.getGames)
app.get('/game/:id', gameRoutes.getGamebyId)
app.post('/game', gameRoutes.addGame)
app.post('/delete-game/:id', gameRoutes.deleteGame)
app.post('/update-game/:id', gameRoutes.updateGame)

// User routes
app.post('/register', userRoutes.registerUser)
app.post('/auth', userRoutes.authUser)

// Port
app.listen(4321, () => {
  console.log("API running...")
}) 