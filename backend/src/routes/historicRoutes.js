const {Router}=require('express')
const auth = require('../middlewares/auth')
const { addProduct, removeProduct, deleteHistoric, clearHistoric, getHistoric, getHistorics, closeHistoric } = require('../controllers/historicControllers')

const routes=new Router()

routes.put('/:idProduct',auth,addProduct)
routes.put('/:idHistoric/:idProduct',auth,removeProduct)
routes.delete('/',auth,clearHistoric)
routes.delete('/:id',auth,deleteHistoric)
routes.get('/:id',auth,getHistoric)
routes.get('/',auth,getHistorics)
routes.put('/open/close/:id',auth,closeHistoric)

module.exports=routes