// Modules
    // node_modules
        const express = require('express')
    // Custom modules
        const {searchById, advancedSearch} = require('../modules/scrap')

// Call
    const route = express.Router()

// Routes
    route.get('/api/title/:imdbId', (req, res) => {
        searchById(req.params.imdbId, info => res.send(info))
    })

    route.get('/api/search/', (req, res) => {
        advancedSearch(req.query, info => res.send(info))
    })

module.exports = route
