const express = require('express')
const app = express()
const userController = require('../controllers/userController')

app.get('/', (req, res) => {
    userController.index(req, res)
})

app.get('/:id', (req, res) => {
    userController.findById(req, res)
})

app.post('/', (req, res) => {
    userController.save(req, save)
})

module.exports = app