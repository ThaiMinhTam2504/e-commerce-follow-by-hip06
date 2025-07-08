const router = require('express').Router();
const { verifyToken, isAdmin } = require('../middleware/verifyToken')
const ctrls = require('../controllers/blog')
const uploader = require('../config/cloudinary_config.js')


router.post('/', [verifyToken, isAdmin], ctrls.createNewBlog)
router.get('/', ctrls.getBlogs)
router.put('/update/:bid', [verifyToken, isAdmin], ctrls.updateBlog)
router.delete('/:bid', [verifyToken, isAdmin], ctrls.deleteBlog)
router.get('/one/:bid', ctrls.getBlog)
router.put('/likes/:bid', [verifyToken], ctrls.likeBlog)
router.put('/dislikes/:bid', [verifyToken], ctrls.dislikeBlog)
router.put('/image/:bid', [verifyToken, isAdmin], uploader.single('image'), ctrls.uploadImagesBlog)


module.exports = router;