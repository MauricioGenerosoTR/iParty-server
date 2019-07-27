module.exports = () => {
    const express = require('express')
    const session = require('express-session')
    const bodyParser = require('body-parser')
    const expressValidator = require('express-validator')
    const cors = require('cors')
    const secret = require('../secret')

    const PORT = process.env.PORT || 3000;

    var app = express()
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(expressValidator())
    app.use(session({
        secret: secret.sessionSecret,
        resave: false,
        saveUninitialized: true
    }))
    app.use(cors())

    require('../app/routes/routes')(app)

    app.listen(PORT, () => {
        console.log(`Server running in port: ${PORT}`);
    })

    /** Don't remove**/
    /*
    const http = require("http");
    setInterval(() => {
        http.get("http://iparty-server.herokuapp.com/keep-alive")
    }, 1500000)
    */
}
