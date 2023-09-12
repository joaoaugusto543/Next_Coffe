require('dotenv').config({
    path: process.env.NODE_ENV.trim() === 'test' ?  '.env.testing' : '.env'
})

const express=require('express')
const cors=require('cors')
const routes = require('./routes/Router')
const path = require('path')

class App{
    constructor(){
        this.server=express()
        this.middlewares()
        this.routes()
    }

    middlewares(){
        this.server.use(express.json())
        this.server.use(cors())
    }

    routes(){
        this.server.use(routes)
        this.server.use('/imgs',express.static(path.join(__dirname,'./imgs')))
    }


}

const app=new App().server

module.exports=app