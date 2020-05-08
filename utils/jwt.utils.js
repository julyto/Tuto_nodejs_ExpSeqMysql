const jwt = require('jsonwebtoken')

const JWT_SIGN_SECRET = '7JvXhhxDS4bN6BvhFtARBHKGUMfePfwxI3w5ui6nBkqwKFW3BA1b9aLX8v5YLhO5'

module.exports = {
    generateTokenForUser: function(userData) {
        return jwt.sign({
            userId: userData.id,
            isAdmin: userData.isAdmin
        },
        JWT_SIGN_SECRET,
        {
            expiresIn: '1h'
        })
    }
}