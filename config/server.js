module.exports = () => {
    const express = require('express')
    const bodyParser = require('body-parser')
    const expressValidator = require('express-validator')

    const PORT = process.env.PORT || 3000;

    var app = express()
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(expressValidator())

    require('../app/routes/routes')(app)

    app.listen(PORT, () => {
        console.log(`Server running in port: ${PORT}`);
    })
}