const express=require('express')
const Router=express()

Router.use('/api/users',require('./userRoutes'))
Router.use('/api/session',require('./sessionRoutes'))
Router.use('/api/products',require('./productRoutes'))
Router.use('/api/historic',require('./historicRoutes'))

module.exports=Router