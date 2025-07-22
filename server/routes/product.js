const router = require('express').Router()
const ctrls = require('../controllers/product')
const { verifyToken, isAdmin } = require('../middleware/verifyToken')
const uploader = require('../config/cloudinary_config.js')


router.post('/', [verifyToken, isAdmin], uploader.fields([
    { name: 'images', maxCount: 10 },
    { name: 'thumb', maxCount: 1 }
]), ctrls.createProduct)
router.get('/:pid', ctrls.getProduct)
router.put('/ratings', [verifyToken], ctrls.ratings)



router.put('/uploadimage/:pid', [verifyToken, isAdmin], uploader.array('images', 10), ctrls.uploadImagesProduct)
router.put('/:pid', [verifyToken, isAdmin], ctrls.updateProduct)
router.delete('/:pid', [verifyToken, isAdmin], ctrls.deleteProduct)
router.get('/', ctrls.getProducts)



module.exports = router

