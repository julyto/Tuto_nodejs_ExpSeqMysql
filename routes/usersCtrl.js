const bcrypt = require('bcrypt')
const jwtUtils = require('../utils/jwt.utils')
const models = require('../models')

module.exports = {
    // pour enregistrer un nouvel utilisateur en bdd
    register: (req, res) => {

        // récupération des paramètres dans la requête
        var email = req.body.email
        var username = req.body.username
        var password = req.body.password
        var bio = req.body.bio

        // vérification des paramètres
        if(email == null || username == null || password == null)  {
            return res.status(400).json({ 'error': 'missing parameters' })
        }

        // recherche de l'utilisateur en bdd avec son email
        models.User.findOne({
            attributes: ['email'], 
            where: { email: email }
        }) 
        .then(function(userFound) {
            if(!userFound) { // si pas d'utilisateur trouvé
                // cryptage du password
                bcrypt.hash(password, 5, function( err, bcryptedPassword) {
                    // création du nouvel utilisateur en bdd
                    var newUser = models.User.create({
                        email: email,
                        username: username,
                        password: bcryptedPassword,
                        bio: bio,
                        isAdmin: 0
                    })
                    .then(function(newUser) {
                        return res.status(201).json({ 'userId': newUser.id})
                    })
                    .catch(function(err) {
                        return res.status(500).json({ 'error': 'cannot add user' })
                    })
                })

            } else { // si l'utilisateur est déja en bdd
                return res.status(409).json({ 'error': 'user already exist' })
            }

        })
        .catch(function(err) {
            return res.status(500).json({ 'error': 'unable to verify user' })
        })
    },
    // pour qu'un utilisateur se log avec vérification pat token
    login: (req, res) => {

        // récupération des paramètres dans la requête
        var email = req.body.email
        var password = req.body.password

        // vérification des paramètres
        if(email == null || password == null)  {
            return res.status(400).json({ 'error': 'missing parameters' })
        }

        // recherche de l'utilisateur en bdd avec son email
        models.User.findOne({
            where: { email: email }
        }) 
        .then(function(userFound) {
            if(userFound) { // si l'utilisateur est trouvé
                // compare le password entré avec celui de la bdd
                bcrypt.compare(password, userFound.password, function(errByCrypt, resByCript) {
                    if(resByCript) {
                        return res.status(200).json({ 
                            'userId': userFound.id,
                            'token': jwtUtils.generateTokenForUser(userFound)
                        })
                    } else {
                        return res.status(403).json({ 'error': 'invalid password' })
                    }
                })
            } else { // si l'utilisateur est déja en bdd
                return res.status(409).json({ 'error': 'user not exist in bdd' })
            }
        })
        .catch(function(err) {
            return res.status(500).json({ 'error': 'unable to verify user' })
        })
    }
}