const express = require('express')
const bodyParser = require('body-parser')
const apiRouter = require('./apiRouter').router

var app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

app.use('/api/', apiRouter)

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html')
    res.status(200).send('<h1>Mise en place du serveur</h1>')
})

app.listen(8080, () =>{
    console.log('Serveur en écoute...')
})