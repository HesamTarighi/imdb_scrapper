// Modules
    // node_modules
        const express = require('express')
    // Custom modules
        const {searchById, searchByTitle, advancedSearch} = require('../modules/scrap')

// Call
    const route = express.Router()

// Routes
    route.get('/api/title/:title', (req, res) => {
        searchByTitle(req.params.title, info => res.send(info))
    })

    route.get('/api/search/:name', (req, res) => {
        searchByName(req.params.name, info => res.send(info))
    })

    route.get('/api/advance_search/', (req, res) => {
        advancedSearch(req.query, info => res.send(info))
    })

module.exports = route
