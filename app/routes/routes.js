const express = require('express')

module.exports = (app) => {
    // Root API Route
    const router = express.Router()
    app.use('/api/iparty', router)

    // Routes
    const userRouterV1 = require('./userRoutesV1')
    router.use('/v1/users', userRouterV1)
}