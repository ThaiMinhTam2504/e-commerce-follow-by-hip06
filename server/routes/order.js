const router = require('express').Router();
const { verifyToken, isAdmin } = require('../middleware/verifyToken')
const ctrls = require('../controllers/order')


router.get('/', [verifyToken], ctrls.getUserOrder)
router.get('/all', [verifyToken, isAdmin], ctrls.getAdminOrders)
router.post('/', [verifyToken], ctrls.createNewOrder)
router.put('/status/:oid', [verifyToken, isAdmin], ctrls.updateStatus)



module.exports = router;