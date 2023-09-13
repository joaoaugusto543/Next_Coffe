const { select, insert, deleteLine, update } = require("../config/db")
const { encryptPassword } = require("../services/cryptography")
const { v4: uuidv4 } = require('uuid')

async function createUser(req,res){
    try {
        const {email,password,image,name}=req.body

        const conditionEmail=`email = '${email}'`

        const user=(await select('users',['id'],conditionEmail))[0]

        if(user){
            return res.status(500).json({error:'User already exists'})
        }

        const id= uuidv4()

        const encryptedPassword=await encryptPassword(password)

        const newUser={
            id,
            email,
            password:encryptedPassword,
            image,
            name
        }

        await insert('users',newUser)

        return res.status(200).json(newUser)

    } catch (error) {
        console.log(error)
        return res.status(500).json({error:'Internal error'})
    }
}

async function createUserAdmin(req,res){
    try {

        const reqUser=req.user

        if(!reqUser.admin){
            return res.status(401).json({error:'Administrators only'})
        }

        const {email,password,image,name}=req.body

        const conditionEmail=`email = '${email}'`

        const user=(await select('users',['id'],conditionEmail))[0]

        if(user){
            return res.status(500).json({error:'User already exists'})
        }

        const id= uuidv4()

        const encryptedPassword=await encryptPassword(password)

        const newUser={
            id,
            email,
            password:encryptedPassword,
            image,
            name,
            admin:true
        }

        await insert('users',newUser)

        return res.status(200).json(newUser)

    } catch (error) {
        console.log(error)
        return res.status(500).json({error:'Internal error'})
    }
}

async function updateUser(req,res){
    try {
        
        const {name,newPassword,image}=req.body

        const user=req.user

        if(!user){
            return res.status(500).json({error:'User does not exist'})
        }
        
        if(newPassword){
            user.password=await encryptPassword(newPassword)
        }

        if(name){
            user.name=name
        }

        if(image){
            user.image=image
        }

        const table='users'

        const columns=['id','name','image']

        const conditionId=`id = '${user.id}'`

        const set=` name = '${user.name}' , password = '${user.password}' , image= '${user.image}'`

        await update(table,set,conditionId)

        const updatedUser=(await select(table,columns,conditionId))[0]

        return res.status(200).json(updatedUser)
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:'Internal error'})
    }
}

async function deleteUser(){
    try {
        const {id}=req.params

        const conditionId=`id = '${id}'`

        const reqUser=req.user

        const user=(await select('users',['id'],conditionId))[0]

        if(!user){
            return res.status(500).json({error:'User not found'})
        }

        if(!reqUser.admin && reqUser.id !== user.id){
            return res.status(401).json({error:'Users cannot delete accounts'})
        }

        await deleteLine('users',conditionId)

    } catch (error) {
        console.log(error)
        return res.status(500).json({error:'Internal error'})
    }
}

function profile(req,res){
    try {

        const reqUser=req.user

        const {id,name,image,email}=reqUser

        if(!reqUser){
            return res.status(500).json({error:'User not found'}) 
        }

        const user={
            id,
            name,
            image,
            email
        }

        return res.status(200).json(user)

    } catch (error) {
        console.log(error)
        return res.status(500).json({error:'Internal error'})
    }
}

const userControllers={
    createUser,
    createUserAdmin,
    updateUser,
    deleteUser,
    profile
}

module.exports=userControllers