const path = require('path')
const http = require('http')
const express = require('express')
const app = express()

app.use(express.static(path.join(__dirname + 'index.html')))
app.get('*', (req, res) => res.sendFile(path.join(__dirname + 'index.html')))

const server = http.createServer(app)
server.listen(process.env.PORT, () => { console.log('Server Started') })