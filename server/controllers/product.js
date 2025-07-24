const { response } = require('express')
const Product = require('../models/product')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')

const createProduct = asyncHandler(async (req, res) => {
    const { title, price, description, brand, category, color } = req.body
    const thumb = req?.files?.thumb?.[0]?.path
    const images = req.files?.images?.map(el => el.path)
    if (!(title && price && description && brand && category && color)) throw new Error('Missing inputs')
    req.body.slug = slugify(title)
    if (thumb) req.body.thumb = thumb
    if (images) req.body.images = images
    const newProduct = await Product.create(req.body)
    return res.status(200).json({
        success: newProduct ? true : false,
        mes: newProduct ? 'Product created successfully!' : 'Something went wrong',
    })
})

const getProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const product = await Product.findById(pid).populate({
        path: 'ratings',
        populate: {
            path: 'postedBy',
            select: 'firstname lastname avatar'
        }
    })
    return res.status(200).json({
        success: product ? true : false,
        productData: product ? product : 'Can not get product'
    })
})
//Filtering,sorting & pagination
const getProducts = asyncHandler(async (req, res) => {
    const queries = { ...req.query }
    //Tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields']
    excludeFields.forEach(el => delete queries[el])

    //Format lại các operators cho đúng với cú pháp mongoose
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedEl => `$${matchedEl}`)
    const formatedQueries = JSON.parse(queryString)
    let colorQueryObject = {}

    //Filtering
    if (queries?.title) formatedQueries.title = { $regex: queries.title, $options: 'i' }
    if (queries?.category) formatedQueries.category = { $regex: queries.category, $options: `i` }
    if (queries?.color) {
        delete formatedQueries.color
        const colorArr = queries.color?.split(',')
        const colorQuery = colorArr.map(el => ({ color: { $regex: el, $options: 'i' } })) // i la viet tat cho case insensitive
        colorQueryObject = { $or: colorQuery }
    }
    let queryObject = {}
    if (queries?.q) {
        delete formatedQueries.q
        queryObject = {
            $or: [
                { color: { $regex: queries.q, $options: 'i' } },
                { title: { $regex: queries.q, $options: 'i' } },
                { category: { $regex: queries.q, $options: 'i' } },
                { brand: { $regex: queries.q, $options: 'i' } },
                // { description: { $regex: queries.q, $options: 'i' } },
            ]
        }
    }
    const qr = { ...colorQueryObject, ...formatedQueries, ...queryObject }
    let queryCommand = Product.find(qr)

    //Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        // console.log(sortBy)
        queryCommand = queryCommand.sort(sortBy)
    }
    //Fields limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ')
        queryCommand = queryCommand.select(fields)
    }
    //Pagination
    //Limit:số object:lấy về 1 lần gọi API
    //skip: bỏ qua bao nhiêu object
    const page = +req.query.page || 1 // operator + để chuyển dạng chuỗi sang số
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS
    const skip = (page - 1) * limit
    queryCommand.skip(skip).limit(limit)



    //Execute query
    //Số lượng sp thỏa mãn điều kiện !== số lượng sp trả về 1 lần gọi API
    // await queryCommand.exec(async (err, response) => {
    //     if (err) throw new Error(err.message)
    //     const counts = await Product.find(formatedQueries).countDocuments()
    //     return res.status(200).json({
    //         success: response ? true : false,
    //         products: response ? response : 'Can not get products',
    //         counts,
    //     })
    // })
    try {
        const response = await queryCommand.exec();
        const counts = await Product.find(qr).countDocuments();
        return res.status(200).json({
            success: response ? true : false,
            counts,
            products: response ? response : 'Can not get products',
        });
    } catch (err) {
        throw new Error(err.message);
    }



})

const updateProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const files = req?.files
    if (files?.thumb) req.body.thumb = files?.thumb[0]?.path
    if (files?.images) req.body.images = files?.images.map(el => el.path)
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const updateProduct = await Product.findByIdAndUpdate(pid, req.body, { new: true })
    return res.status(200).json({
        success: updateProduct ? true : false,
        mes: updateProduct ? 'Updated successfully' : 'Can not update product'
    })
})

const deleteProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const deleteProduct = await Product.findByIdAndDelete(pid, req.body, { new: true })
    return res.status(200).json({
        success: deleteProduct ? true : false,
        mes: deleteProduct ? 'Deleted successfully' : 'Can not delete product'
    })
})
const ratings = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { star, comment, pid, updatedAt } = req.body
    if (!star || !pid) throw new Error('Missing inputs')
    const ratingProduct = await Product.findById(pid)
    const alreadyRated = ratingProduct?.ratings?.find(el => el.postedBy.toString() === _id.toString())
    // console.log(alreadyRated)
    if (alreadyRated) {
        //update star & comment
        await Product.updateOne({
            ratings: { $elemMatch: alreadyRated }
        }, {
            $set: {
                "ratings.$.star": star,
                "ratings.$.comment": comment,
                "ratings.$.updatedAt": updatedAt
            }
        },
            { new: true })

    } else {
        //create new rating
        await Product.findByIdAndUpdate(pid, {
            $push: { ratings: { star, comment, postedBy: _id, updatedAt } }
        }, { new: true })
    }
    //total ratings
    const updatedProduct = await Product.findById(pid)
    const ratingCount = updatedProduct.ratings.length
    const sumRatings = updatedProduct.ratings.reduce((sum, el) => sum + +el.star, 0)
    updatedProduct.totalRatings = Math.round(sumRatings * 10 / ratingCount) / 10
    console.log(updatedProduct.totalRatings)
    await updatedProduct.save()

    return res.status(200).json({
        status: true,
        updateProduct,
    })
})

const uploadImagesProduct = asyncHandler(async (req, res) => {
    //console.log(req.files)
    const { pid } = req.params
    if (!req.files) throw new Error('Missing images')
    const response = await Product.findByIdAndUpdate(pid, { $push: { images: { $each: req.files.map(el => el.path) } } }, { new: true })
    return res.status(200).json({
        status: response ? true : false,
        updatedProduct: response ? response : 'Can not update images product'
    })

})


module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    ratings,
    uploadImagesProduct,
}