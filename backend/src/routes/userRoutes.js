const {Router}=require('express')
const auth = require('../middlewares/auth')
const { createUser, createUserAdmin, profile, updateUser, deleteUser, addToFavorites, removeToFavorites } = require('../controllers/userControllers')
const { validationCreateUser, validationUpdateUser } = require('../middlewares/userValidation')
const handleValidation = require('../middlewares/handleValidation')

const routes=new Router()

routes.post('/',validationCreateUser(),handleValidation,createUser)
routes.post('/createadmin',auth,validationCreateUser(),handleValidation,createUserAdmin)
routes.get('/',auth,profile)
routes.put('/',auth,validationUpdateUser(),handleValidation,updateUser)
routes.put('/:idProduct',auth,addToFavorites)
routes.put('/remove/:idProduct',auth,removeToFavorites)
routes.delete('/:id',auth,deleteUser)

module.exports=routes