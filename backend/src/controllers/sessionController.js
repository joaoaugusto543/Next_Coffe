require('dotenv').config({
    path: process.env.NODE_ENV.trim() === 'test' ?  '.env.testing' : '.env'
})

const  {select}=require('../config/db')
const { verifyPassword }=require('../services/cryptography')
const jwt=require('jsonwebtoken')

async function createSession(req,res){
    try {

        const {email,password}=req.body

        const tableUsers='users'
    
        const conditionEmail=`email = '${email}'`
        
        const columns=['id','name','email','image','password']

        const user=(await select(tableUsers,columns,conditionEmail))[0]

        if(!user){       
            return res.status(401).json({authenticationError:'user / password invalid'})
        }
  
        if(!await verifyPassword(user,password)){
            return res.status(401).json({authenticationError:'user / password invalid'})
        }
        
        const {id,name,image}=user
                
        const secret=process.env.TOKEN_SECRET

        return res.status(200).json(
            {
                user:{
                    id,
                    name,
                    email,
                    image
                },
                token:jwt.sign({id},secret,{
                    expiresIn:'7d'
                })
            }
        )
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:'Internal error'})
    }
}

const sessionsControllers={
    createSession
}

module.exports=sessionsControllers