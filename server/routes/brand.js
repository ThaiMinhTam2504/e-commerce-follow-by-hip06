const router = require('express').Router()
const ctrls = require('../controllers/brand')
const { verifyToken, isAdmin } = require('../middleware/verifyToken')

router.post('/', [verifyToken, isAdmin], ctrls.createNewBrand)
router.get('/', ctrls.getBrands)
router.put('/:bid', [verifyToken, isAdmin], ctrls.updateBrand)
router.delete('/:bid', [verifyToken, isAdmin], ctrls.deleteBrand)





module.exports = router 