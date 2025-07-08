const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const verifyToken = asyncHandler(async (req, res, next) => {
    //Bearer token
    //headers: {authorization: Bearer token}
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1] //Tách mảng ra thành 2 phần dựa vào khoảng trắng, phần 1 là Bearer, phần 2 là token.Lấy phần 2 ra
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return res.status(401).json({
                success: false,
                mes: 'Invalid access token'
            })
            // console.log(decoded)
            req.user = decoded;
            // console.log(req.user)
            next()
        })
    } else {
        return res.status(401).json({
            success: false,
            mes: 'Require authentication!!'
        })
    }
})

const isAdmin = asyncHandler(async (req, res, next) => {
    const { role } = req.user
    if (+role !== 0)
        res.status(401).json({
            success: false,
            mes: "Require admin role!!"
        })
    next()
})

module.exports = {
    verifyToken,
    isAdmin,
}