const Promise = require('bluebird')
const db = require('../database/db')

const getQueryRes = async (query) => new Promise((resolve, reject) => {
  db.query(query, (err, res) => {
    if (err) reject(err)
    else resolve(res)
  })
})

module.exports = getQueryRes