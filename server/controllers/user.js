const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const { generateAccessToken, generateRefreshToken } = require('../middleware/jwt');
const { response } = require('express');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/sendMail');
const crypto = require('crypto');
const makeToken = require('uniqid')
const { users } = require('../utils/contants');
const path = require('path');


// const register = asyncHandler(async (req, res) => {
//     const { email, password, firstname, lastname, mobile } = req.body
//     if ((!email || !password || !firstname || !lastname || !mobile))
//         return res.status(400).json({
//             success: false,
//             message: 'Please fill all fields'
//         })

//     const user = await User.findOne({ email: email })
//     if (user)
//         throw new Error('Email already exists!')
//     else {
//         const newUser = await User.create(req.body)
//         return res.status(200).json({
//             success: newUser ? true : false,
//             mes: newUser ? 'Register is successfully' : 'Register is failed'

//         })
//     }

// })


const deleteTemporaryAccount = asyncHandler(async (req, res) => {
    const { email } = req.body
    if (!email) {
        return res.status(400).json({
            success: false,
            mes: 'Email is required'
        })
    }
    //Tìm tài khoản tạm thời trong database dựa trên email gốc
    const user = await User.findOne({ email: new RegExp(`^${btoa(email)}`) })
    if (!user) {
        return res.status(404).json({
            success: false,
            mes: 'Temporary account not found'
        })
    }

    //Xóa tài khoản tạm thời
    const deletedUser = await User.deleteOne({ email: user.email })
    if (deletedUser.deletedCount > 0) {
        return res.status(200).json({
            success: true,
            mes: 'Temporary account deleted successfully'
        })
    } else {
        return res.status(404).json({
            success: false,
            mes: 'Failed to delete temporary account'
        })
    }


})



//REGISTER có xác thực mail

const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname, mobile } = req.body
    if ((!email || !password || !firstname || !lastname || !mobile)) {
        return res.status(400).json({
            success: false,
            message: 'Please fill all fields'
        })
    }
    const user = await User.findOne({ email })
    if (user) throw new Error('Email already exists!')
    else {
        const token = makeToken()
        const emailedited = btoa(email) + '@' + token


        // res.cookie('dataregister', { ...req.body, token }, { httpOnly: true, maxAge: 15 * 60 * 1000 })
        // const html = `Xin vui lòng click vào link dưới đây để hoàn tất quá trình đăng ký.Link này sẽ hết hạn sau 15 phút kể từ lúc nhận mail 
        //  <a href=${process.env.URL_SERVER}/api/user/finalregister/${token}>Click here</a>`
        const newUser = await User.create({
            email: emailedited,
            password,
            firstname,
            lastname,
            mobile,
        })
        // console.log('newUser', newUser)
        if (newUser) {
            const html = `<h2>Register code:</h2><br/><blockquote>${token}</blockquote>`
            await sendMail({ email, html, subject: 'Email Confirmation -- Digital Store' })
            // console.log('Email sent successfully')
        }
        setTimeout(async () => {
            // console.log('Deleting user with email:', emailedited);
            await User.deleteOne({ email: emailedited })
        }, [15 * 60 * 1000])
        return res.json({
            success: newUser ? true : false,
            mes: newUser ? 'Please check your email to confirm your account' : 'Register is failed'
        })
    }

})

const finalRegister = asyncHandler(async (req, res) => {
    // const cookie = req.cookies
    const { token } = req.params
    // if (!cookie || cookie?.dataregister?.token !== token) {
    //     res.clearCookie('dataregister')
    //     return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`)
    // }
    const notActivedEmail = await User.findOne({ email: new RegExp(`${token}$`) })
    if (notActivedEmail) {
        notActivedEmail.email = atob(notActivedEmail?.email?.split('@')[0])
        notActivedEmail.save()
    }
    return res.json({
        success: notActivedEmail ? true : false,
        mes: notActivedEmail ? 'Register successfully. Please go login.' : 'Something went wrong!,Please try again'
    })
    // const newUser = await User.create({
    //     email: cookie?.dataregister?.email,
    //     password: cookie?.dataregister?.password,
    //     firstname: cookie?.dataregister?.firstname,
    //     lastname: cookie?.dataregister?.lastname,
    //     mobile: cookie?.dataregister?.mobile
    // })
    // res.clearCookie('dataregister')
    // if (newUser) return res.redirect(`${process.env.CLIENT_URL}/finalregister/success`)
    // else
    //     return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`)
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
    if (response && await response.isCorrectPassword(password)) {
        const { password, role, refreshToken, ...userData } = response.toObject() //lấy 2 trường password và role ra khỏi userData
        const accessToken = generateAccessToken(response._id, role) // Tạo accessToken
        const newRefreshToken = generateRefreshToken(response._id)    //Tạo refreshToken
        await User.findByIdAndUpdate(response._id, { refreshToken: newRefreshToken }, { new: true }) // tìm vào database coi _id của email đầu vào có trùng với _id nào trong database không, nếu trùng thì update refreshToken
        //Lưu refreshToken vào cookie
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
        return res.status(200).json({
            success: true,
            mes: 'Login is successfully',
            accessToken,
            userData
        })
    } else {
        // throw new Error('Invalid credentials!')
        return res.status(401).json({
            success: false,
            mes: 'Invalid credentials!'
        })
    }
})

// const login = asyncHandler(async (req, res) => {
//     const { email, password } = req.body;
//     if (!email || !password) {
//         return res.status(400).json({
//             success: false,
//             message: 'Missing input'
//         });
//     }

//     const response = await User.findOne({ email: email });
//     if (response && await response.isCorretPassword(password)) {
//         const { password, role, refreshToken, ...userData } = response.toObject(); // Lấy 2 trường password và role ra khỏi userData
//         const accessToken = generateAccessToken(response._id, role); // Tạo accessToken
//         const newRefreshToken = generateRefreshToken(response._id); // Tạo refreshToken
//         await User.findByIdAndUpdate(response._id, { refreshToken: newRefreshToken }, { new: true }); // Tìm vào database coi _id của email đầu vào có trùng với _id nào trong database không, nếu trùng thì update refreshToken
//         // Lưu refreshToken vào cookie
//         res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
//         return res.status(200).json({
//             success: true,
//             mes: 'Login is successfully',
//             accessToken,
//             userData
//         });
//     } else {
//         throw new Error('Invalid credentials!');
//     }
// })


const getCurrent = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const user = await User.findById(_id).select('-refreshToken -password').populate({
        path: 'cart',
        populate: {
            path: 'product',
            select: 'title thumb price'
        }
    })
    return res.status(200).json({
        success: user ? true : false,
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
//Client gửi email
//Server check xem email có hợp lệ hay không=>Gửi mail + kèm theo link  (password change token)
//Client check mail =>Click link
//Client gửi api kèm theo token
//Check token có giống với token mà server gửi không
//Change password

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body
    if (!email) throw new Error('Missing email')
    const user = await User.findOne({ email: email })
    if (!user) throw new Error('User not found')
    const resetToken = user.createPasswordChangeToken()
    await user.save()

    const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn.Link này sẽ hết hạn sau 15 phút kể từ lúc nhận mail <a href=${process.env.CLIENT_URL}/reset-password/${resetToken}>Click here</a>`

    const data = {
        email,
        html,
        subject: 'Forgot password'
    }
    const rs = await sendMail(data)
    return res.status(200).json({
        success: rs.response?.includes('OK') ? true : false,
        mes: rs.response?.includes('OK') ? 'Email sent successfully' : 'Email sent failed'
    })
})

const resetPassword = asyncHandler(async (req, res) => {
    const { token, password } = req.body
    if (!password || !token) throw new Error('Missing input')
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } })
    if (!user) throw new Error('Invalid reset token')
    user.password = password
    user.passwordResetToken = undefined
    user.passwordChangeAt = Date.now()
    user.passwordResetExpires = undefined
    await user.save()
    return res.status(200).json({
        success: user ? true : false,
        mes: user ? 'Updated password' : 'Failed to update password'
    })
})

const getUsers = asyncHandler(async (req, res) => {
    const queries = { ...req.query }
    const excludeFields = ['limit', 'sort', 'page', 'fields']
    excludeFields.forEach(el => delete queries[el])

    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, matchedEl => `${matchedEl}`)
    const formatedQueries = JSON.parse(queryString)

    if (queries?.name) formatedQueries.name = { $regex: queries.name, $options: 'i' }

    // const query = {}
    // if (req.query.q) {
    //     query = {
    //         $or: [
    //             { name: { $regex: req.query.q, $options: 'i' } },
    //             { email: { $regex: req.query.q, $options: 'i' } },
    //         ]
    //     }
    // }
    if (req.query.q) {
        delete formatedQueries.q
        formatedQueries['$or'] = [
            { firstname: { $regex: req.query.q, $options: 'i' } },
            { lastname: { $regex: req.query.q, $options: 'i' } },
            { mobile: { $regex: req.query.q, $options: 'i' } },
            { email: { $regex: req.query.q, $options: 'i' } },
        ]
    }
    let queryCommand = User.find(formatedQueries)

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join('')
        queryCommand = queryCommand.sort(sortBy)
    }

    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ')
        queryCommand = queryCommand.select(fields)
    }


    const page = +req.query.page || 1
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS
    const skip = (page - 1) * limit
    queryCommand.skip(skip).limit(limit)
    try {
        const response = await queryCommand.exec()
        const counts = await User.countDocuments(formatedQueries)
        return res.status(200).json({
            success: response ? true : false,
            counts,
            users: response ? response : 'User not found'
        });
    } catch (err) {
        throw new Error(err.message);
    }
})

const deleteUser = asyncHandler(async (req, res) => {
    const { uid } = req.params
    const response = await User.findByIdAndDelete(uid)
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? `User with email: ${response.email} deleted` : `User not found`
    })

})

const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { firstname, lastname, email, mobile } = req.body
    const data = { firstname, lastname, email, mobile }
    if (req.file) data.avatar = req.file.path
    if (!_id || Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const response = await User.findByIdAndUpdate(_id, data, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Updated successfully' : 'Something went wrong!'
    })
})

const updateUserByAdmin = asyncHandler(async (req, res) => {
    const { uid } = req.params
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const response = await User.findByIdAndUpdate(uid, req.body, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'User updated successfully' : 'Something went wrong!'
    })
})

const updateUserAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user
    if (!req.body.address) throw new Error('Missing input')

    const user = await User.findOne({ _id: _id })

    if (user.address.includes(req.body.address)) {
        return res.status(400).json({
            success: false,
            message: 'Address already exists!'
        })
    }

    const response = await User.findByIdAndUpdate(_id, { $push: { address: req.body.address } }, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : 'Something went wrong!'
    })
})

const updateCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { pid, quantity = 1, color } = req.body
    if (!pid || !color) throw new Error('Missing input')
    const user = await User.findById(_id).select('cart')
    const alreadyProduct = user?.cart?.find(el => el.product.toString() === pid)
    if (alreadyProduct) {
        const response = await User.updateOne({ cart: { $elemMatch: alreadyProduct } }, { $set: { "cart.$.quantity": quantity, "cart.$.color": color } }, { new: true }).select('-password -role -refreshToken')
        return res.status(200).json({
            success: response ? true : false,
            mes: response ? 'Your cart has been updated!' : 'Something went wrong!'

        })
    } else {
        const response = await User.findByIdAndUpdate(_id, { $push: { cart: { product: pid, quantity, color } } }, { new: true }).select('-password -role -refreshToken')
        return res.status(200).json({
            success: response ? true : false,
            mes: response ? 'Your cart has been updated!' : 'Something went wrong!'
        })
    }
})

const removeProductFromCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { pid } = req.params
    const user = await User.findById(_id).select('cart')
    const alreadyProduct = user?.cart?.find(el => el.product.toString() === pid)
    if (!alreadyProduct) return res.status(200).json({
        success: true,
        mes: 'Product not found in cart'
    })
    const response = await User.findByIdAndUpdate(_id, { $pull: { cart: { product: pid } } }, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Product removed from cart successfully!' : 'Something went wrong!'
    })
})

const createUsers = asyncHandler(async (req, res) => {
    const response = await User.create(users)
    return res.status(200).json({
        success: response ? true : false,
        users: response ? response : 'Something went wrong!'
    })
})

module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword,
    getUsers,
    deleteUser,
    updateUser,
    updateUserByAdmin,
    updateUserAddress,
    updateCart,
    finalRegister,
    deleteTemporaryAccount,
    createUsers,
    removeProductFromCart
}