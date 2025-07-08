const router = require('express').Router();
const { verifyToken, isAdmin } = require('../middleware/verifyToken')
const ctrls = require('../controllers/coupon')


router.post('/', [verifyToken, isAdmin], ctrls.createNewCoupon)
router.get('/', ctrls.getCoupons)
router.put('/:cid', [verifyToken, isAdmin], ctrls.updateCoupon)
router.delete('/:cid', [verifyToken, isAdmin], ctrls.deleteCoupon)


module.exports = router;