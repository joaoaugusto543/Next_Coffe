const {Router}=require('express')
const { createSession } = require('../controllers/sessionController')

const routes=new Router()

routes.post('/',createSession)


module.exports=routes