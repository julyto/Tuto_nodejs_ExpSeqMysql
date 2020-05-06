const express = require('express')

var app = express()

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html')
    res.status(200).send('<h1>Mise en place du serveur</h1>')
})

app.listen(8080, () =>{
    console.log('Serveur en écoute...')
})