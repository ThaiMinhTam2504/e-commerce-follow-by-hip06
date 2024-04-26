const jwt = require('jsonwebtoken')

const generateAccessToken = (uid, role) => jwt.sign({ _id: uid, role }, process.env.JWT_SECRET, { expiresIn: '3d' })
//trong arrow function nếu chỉ có 1 dòng thì không cần return. tức là nó tự hiểu return

const generateRefreshToken = (uid) => jwt.sign({ _id: uid }, process.env.JWT_SECRET, { expiresIn: '7d' })

module.exports = {
    generateAccessToken,
    generateRefreshToken
}


