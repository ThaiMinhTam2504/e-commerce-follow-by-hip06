const router = require('express').Router()
const ctrls = require('../controllers/blogCategory')
const { verifyToken, isAdmin } = require('../middleware/verifyToken')

router.post('/', [verifyToken, isAdmin], ctrls.createCategory)
router.get('/', ctrls.getAllCategories)
router.put('/:bcid', [verifyToken, isAdmin], ctrls.updateCategory)
router.delete('/:bcid', [verifyToken, isAdmin], ctrls.deleteCategory)





module.exports = router 