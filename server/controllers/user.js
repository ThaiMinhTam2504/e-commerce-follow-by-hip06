const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const { generateAccessToken, generateRefreshToken } = require('../middleware/jwt');
const { response } = require('express');
const jwt = require('jsonwebtoken');

const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname } = req.body
    if ((!email || !password || !firstname || !lastname))
        return res.status(400).json({
            success: false,
            message: 'Please fill all fields'
        })

    const user = await User.findOne({ email: email })
    if (user)
        throw new Error('Email already exists!')
    else {
        const newUser = await User.create(req.body)
        return res.status(200).json({
            success: newUser ? true : false,
            mes: newUser ? 'Register is successfully' : 'Register is failed'

        })
    }

})
//refreshToken => Cấp mới accessToken
// AccessToken=>Xác thực người dùng,phân quyền người dùng
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if ((!email || !password))
        return res.status(400).json({
            success: false,
            message: 'Missing input'
        })

    const response = await User.findOne({ email: email })
    if (response && await response.isCorretPassword(password)) {
        const { password, role, ...userData } = response.toObject() //lấy 2 trường password và role ra khỏi userData
        const accessToken = generateAccessToken(response._id, role) // Tạo accessToken
        const refreshToken = generateRefreshToken(response._id)    //Tạo refreshToken
        await User.findByIdAndUpdate(response._id, { refreshToken: refreshToken }, { new: true }) // tìm vào database coi _id của email đầu vào có trùng với _id nào trong database không, nếu trùng thì update refreshToken
        //Lưu refreshToken vào cookie
        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
        return res.status(200).json({
            success: true,
            mes: 'Login is successfully',
            accessToken,
            userData
        })
    } else {
        throw new Error('Invalid credentials!')
    }
})


const getCurrent = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const user = await User.findById(_id).select('-refreshToken -password -role')
    return res.status(200).json({
        success: true,
        rs: user ? user : 'User not found'
    })
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    //lấy token ra cookie
    const cookie = req.cookies
    //Check xem có token hay không  
    if (!cookie && cookie.refreshToken) throw new Error('No refresh token in cookies')
    //Check token có hợp lệ hay không
    const result = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET)
    const response = await User.findOne({ _id: result._id }, { refreshToken: cookie.refreshToken })
    return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response ? generateAccessToken(response._id, response.role) : 'Refresh Token not matched'
    })
})

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie || !cookie.refreshToken) throw new Error('No refresh token in cookies')
    //Xóa refresh token trong database
    await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, { new: true })
    //Xóa refresh token trong cookie
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
    })
    return res.status(200).json({
        success: true,
        mes: 'Logout is successfully'
    })
})


module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout,
}