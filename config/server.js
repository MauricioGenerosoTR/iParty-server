const express = require('express')
const bodyParser = require('body-parser')

const PORT = process.env.PORT || 3000;

var app = express()
require('../app/routes/routes')(app)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.listen(PORT, () => {
    console.log(`Server running in port: ${PORT}`);
})

module.exports = app;