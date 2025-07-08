const BlogCategory = require('../models/blogCategory')
const asyncHandler = require('express-async-handler')

const createCategory = asyncHandler(async (req, res) => {
    const response = await BlogCategory.create(req.body)
    return res.json({
        success: response ? true : false,
        createdCategory: response ? response : 'Can not create blog category'
    })
})
const getAllCategories = asyncHandler(async (req, res) => {
    const response = await BlogCategory.find().select('title _id')
    return res.json({
        success: response ? true : false,
        categories: response ? response : 'Can not get blogs categories'
    })
})
const updateCategory = asyncHandler(async (req, res) => {
    const { bcid } = req.params
    const response = await BlogCategory.findByIdAndUpdate(bcid, req.body, { new: true })
    return res.json({
        success: response ? true : false,
        updatedCategory: response ? response : 'Can not update blog category'
    })
})
const deleteCategory = asyncHandler(async (req, res) => {
    const { bcid } = req.params
    const response = await BlogCategory.findByIdAndDelete(bcid)
    return res.json({
        success: response ? true : false,
        deletedCategory: response ? response : 'Can not delete blog category'
    })
})
module.exports = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
}