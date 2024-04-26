const router = require('express').Router()
const ctrls = require('../controllers/user')
const { verifyToken } = require('../middleware/verifyToken')

router.post('/register', ctrls.register)
router.get('/login', ctrls.login)
router.get('/current', verifyToken, ctrls.getCurrent)
router.post('/refreshtoken', ctrls.refreshAccessToken)
router.get('/logout', ctrls.logout)



module.exports = router