const express = require('express')

module.exports = (app) => {

    app.get('/keep-alive', (req, res) => {
        console.log('keep alive')
        res.status(200).end()
    })

    // Root Open API Route
    const openRouter = express.Router()
    app.use('/api', openRouter)

    require('./authRoutes')(openRouter)

    // Root Protected API Route
    const protectedRouter = express.Router()
    const auth = require('../../config/auth')
    app.use('/api/v1', protectedRouter)
    protectedRouter.use(auth)

    // Routes
    require('./userRoutesV1')(protectedRouter)
}