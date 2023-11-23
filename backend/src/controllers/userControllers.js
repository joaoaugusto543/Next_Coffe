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

async function deleteUser(req,res){
    try {
        const {id}=req.params

        const conditionId=`id = '${id}'`

        const reqUser=req.user

        const user=(await select('users',['id'],conditionId))[0]

        if(!user){
            return res.status(404).json({error:'User not found'})
        }

        if(!reqUser.admin && reqUser.id !== user.id){
            return res.status(401).json({error:'Users cannot delete accounts'})
        }

        const conditionIdUser=`id_user = '${id}'`

        await deleteLine('comments',conditionIdUser)

        await deleteLine('users',conditionId)

        return res.status(200).json(user)

    } catch (error) {
        console.log(error)
        return res.status(500).json({error:'Internal error'})
    }
}

function profile(req,res){
    try {

        const reqUser=req.user

        if(!reqUser){
            return res.status(404).json({error:'User not found'}) 
        }
        
        const {id,name,image,email,favorites}=reqUser

        const favoritesJson=favorites.map(favorite => JSON.parse(favorite))

        const user={
            id,
            name,
            image,
            email,
            favorites:favoritesJson
        }

        return res.status(200).json(user)

    } catch (error) {
        console.log(error)
        return res.status(500).json({error:'Internal error'})
    }
}

async function addToFavorites(req,res){
    try {
        const reqUser=req.user

        if(!reqUser){
            return res.status(404).json({error:'User not found'}) 
        }

        const {idProduct}=req.params

        const conditionIdProduct=`id = '${idProduct}'`

        const product=(await select('products',['id'],conditionIdProduct))[0]

        if(!product){
            return res.status(404).json({error:'Product not found'})
        }
        
        if(reqUser.favorites.includes(JSON.stringify(product))){
            return res.status(500).json({error:'Was once a favorite'})
        }

        
        const favorites=reqUser.favorites.map((favorite)=>{
            return "'" + favorite + "'"
        })
        
        favorites.push("'" + JSON.stringify(product) + "'")
        
        reqUser.favorites=favorites
        
        const set=` favorites = array [${reqUser.favorites}]`
        
        const conditionId=`id = '${reqUser.id}'`
        
        await update('users',set,conditionId)
        

        return res.status(200).json(product)

    } catch (error) {
        console.log(error)
        return res.status(500).json({error:'Internal error'})
    } 
}

async function removeToFavorites(req,res){
    try {
        const reqUser=req.user

        if(!reqUser){
            return res.status(404).json({error:'User not found'}) 
        }

        const {idProduct}=req.params

        const favoritesJson=reqUser.favorites.map((favorite)=>JSON.parse(favorite))

        const favorite=favoritesJson.find((favorite)=>favorite.id===idProduct)

        if(!favorite){
            return res.status(404).json({error:'Product not found'}) 
        }

        const filteredFavorites=favoritesJson.filter((favorite)=>favorite.id !== idProduct)

        const favoritesString=filteredFavorites.map((favorite)=> "'" + JSON.stringify(favorite) + "'")

        const conditionId=`id = '${reqUser.id}'`

        if(filteredFavorites.length !== 0){

            const set=` favorites = array [${favoritesString}]`
            await update('users',set,conditionId)
 
        }else{
 
            const set=` favorites = '{}'`
 
            await update('users',set,conditionId) 
        }

        return res.status(200).json({filteredFavorites})

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
    profile,
    addToFavorites,
    removeToFavorites
}

module.exports=userControllers