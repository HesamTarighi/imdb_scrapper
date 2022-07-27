// Modules
const express = require('express')
const routes = require('./middlewares/routes')
const cors = require('cors')

// Call
const app = express()

// Use middlewares
app.use(cors())
app.use(routes)
app.use(express.json())

// Liste on port 3000
app.listen(3000)
