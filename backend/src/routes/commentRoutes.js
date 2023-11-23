const {Router}=require('express')
const auth = require('../middlewares/auth')
const { createComment, deleteComment, getComments } = require('../controllers/commentsControllers')
const { validationCreateComment } = require('../middlewares/commentValidation')
const handleValidation = require('../middlewares/handleValidation')

const routes=new Router()

routes.post('/:idProduct',auth,validationCreateComment(),handleValidation,createComment)
routes.delete('/:id',auth,deleteComment)
routes.get('/:idProduct',getComments)



module.exports=routes