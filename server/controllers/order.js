const Order = require('../models/order')
const User = require('../models/user')
const Coupon = require('../models/coupon')
const asyncHandler = require('express-async-handler')

const createNewOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { products, total, address, status } = req.body
    if (address) {
        await User.findByIdAndUpdate(_id, { address: address, cart: [] })
    }
    const data = { products, total, postedBy: _id }
    if (status) data.status = status
    const rs = await Order.create(data)

    return res.json({
        success: rs ? true : false,
        createdOrder: rs ? rs : 'Something went wrong!'
    })
})

const updateStatus = asyncHandler(async (req, res) => {
    const { oid } = req.params
    const { status } = req.body
    if (!status) throw new Error('Status is required!')
    const response = await Order.findByIdAndUpdate(oid, { status: req.body.status }, { new: true })
    return res.json({
        success: response ? true : false,
        rs: response ? response : 'Something went wrong!'
    })
})

const getUserOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const response = await Order.find({ orderBy: _id })
    return res.json({
        success: response ? true : false,
        rs: response ? response : 'Something went wrong!'
    })
})

const getAdminOrders = asyncHandler(async (req, res) => {

    const response = await Order.find()
    return res.json({
        success: response ? true : false,
        rs: response ? response : 'Something went wrong!'
    })
})




module.exports = {
    createNewOrder,
    updateStatus,
    getUserOrder,
    getAdminOrders,
}
