const express=require('express')
const Router=express()

Router.use('/hello',(req,res)=>{
    return res.status(200).json({hello:'hello'})
})

module.exports=Router