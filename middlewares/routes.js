// Modules
    // node_modules
        const express = require('express')
    // Custom modules
        const {searchById, searchByTitle, advancedSearch} = require('../modules/scrap')

// Call
    const route = express.Router()

// Routes
    route.get('/api/title/:imdbId', (req, res) => {
        searchById(req.params.imdbId, info => res.send(info))
    })

    route.get('/api/search/:title', (req, res) => {
        searchByTitle(req.params.title, info => res.send(info))
    })

    route.get('/api/advance_search/', (req, res) => {
        advancedSearch(req.query, info => res.send(info))
    })

module.exports = route
