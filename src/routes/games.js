const db = require('../database/db')

function getGames(req, res) {
  db.query('SELECT * FROM games', (err, result) => {
    if ( err ) res.status(404).send("nenhum jogo encontrado")
    else return res.status(200).send({ user:req.loggedUser, games:result})
  })
}

function getGamebyId(req, res) {
  const id = req.params.id

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
}

function addGame(req, res) {
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
}

function deleteGame(req, res) {
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
}

function updateGame (req, res) {
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
}

module.exports = {
  getGames,
  getGamebyId,
  addGame,
  deleteGame,
  updateGame
}