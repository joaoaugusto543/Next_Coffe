require('dotenv').config({
    path: process.env.NODE_ENV.trim() === 'test' ?  '.env.testing' : '.env'
})

require('./config/db')

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
        this.server.use('/videos',express.static(path.join(__dirname,'./videos')))
        this.server.use('/gifs',express.static(path.join(__dirname,'./gifs')))
    }


}

const app=new App().server

module.exports=app