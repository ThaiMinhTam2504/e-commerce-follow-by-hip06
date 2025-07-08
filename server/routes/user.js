const router = require('express').Router()
const ctrls = require('../controllers/user')
const { verifyToken, isAdmin } = require('../middleware/verifyToken')


router.put('/cart', [verifyToken], ctrls.updateCart)
router.put('/address', [verifyToken], ctrls.updateUserAddress)
router.post('/register', ctrls.register)
router.post('/mock', ctrls.createUsers)
router.put('/finalregister/:token', ctrls.finalRegister)
router.post('/login', ctrls.login)
router.get('/current', [verifyToken], ctrls.getCurrent)
router.post('/refreshtoken', ctrls.refreshAccessToken)
router.get('/logout', ctrls.logout)
router.post('/forgotpassword', ctrls.forgotPassword)
router.put('/resetpassword', ctrls.resetPassword)
router.get('/', [verifyToken, isAdmin], ctrls.getUsers) // bỏ vào [] tức là phải qua cả 2 middleware verifyToken và isAdmin mới được phép vào hàm ctrls.getUsers
router.delete('/:uid', [verifyToken, isAdmin], ctrls.deleteUser)
router.put('/current', [verifyToken], ctrls.updateUser)
router.put('/:uid', [verifyToken, isAdmin], ctrls.updateUserByAdmin)
router.delete('/delete-temporary-account', ctrls.deleteTemporaryAccount)



module.exports = router

//CRUD | Create - Read - Update - Delete | POST - GET - PUT - DELETE
//CREATE (POST) + PUT - body
//GET + DELETE - query  