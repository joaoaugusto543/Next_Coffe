const {Router}=require('express')
const auth = require('../middlewares/auth')
const handleValidation = require('../middlewares/handleValidation')
const { createProduct, updateProduct, deleteProduct, getProducts, getProduct, filterProducts } = require('../controllers/productsControllers')
const { validationCreateProduct, validationUpdateProduct } = require('../middlewares/productValidation')

const routes=new Router()

routes.post('/',auth,validationCreateProduct(),handleValidation,createProduct)
routes.put('/:id',auth,validationUpdateProduct(),handleValidation,updateProduct)
routes.delete('/:id',auth,deleteProduct)
routes.get('/',getProducts)
routes.get('/:id',getProduct)
routes.get('/filter/:type',filterProducts)

module.exports=routes