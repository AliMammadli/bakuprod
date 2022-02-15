const path = require('path')
const http = require('http')
const express = require('express')
const app = express()

app.use(express.static(path.join(__dirname + '/public')))
app.get('*', (req, res) => res.sendFile(path.join(__dirname + '/public')))

const port = process.env.PORT || 3000

const server = http.createServer(app)
server.listen(port, () => { console.log('Server Started') })