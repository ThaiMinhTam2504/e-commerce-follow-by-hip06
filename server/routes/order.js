const router = require('express').Router();
const { verifyToken, isAdmin } = require('../middleware/verifyToken')
const ctrls = require('../controllers/order')


router.post('/', [verifyToken], ctrls.createNewOrder)
router.put('/status/:oid', [verifyToken, isAdmin], ctrls.updateStatus)
router.get('/', [verifyToken], ctrls.getUserOrder)
router.get('/admin', [verifyToken, isAdmin], ctrls.getAdminOrders)



module.exports = router;