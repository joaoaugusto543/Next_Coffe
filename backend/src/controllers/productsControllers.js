const { v4: uuidv4 } = require('uuid')
const { insert, select, update, deleteLine } = require('../config/db')

async function createProduct(req,res){
    try {

        const reqUser=req.user

        if(!reqUser.admin){
            return res.status(401).json({error:'Administrators only'})
        }

        const {image,name,price,type,description}=req.body

        const id= uuidv4()

        const newProduct={
            id,
            image,
            name,
            price,
            type,
            description
        }

        await insert('products',newProduct)
        
        return res.status(200).json(newProduct)

    } catch (error) {
        console.log(error)
        return res.status(500).json({error:'Internal error'})
    }
}

async function updateProduct(req,res){
    try {

        const reqUser=req.user

        if(!reqUser.admin){
            return res.status(401).json({error:'Administrators only'})
        }

        const {id}=req.params

        const conditionId=`id = '${id}'`
        
        const product=(await select('products',['image','name','price','type','description','discount'],conditionId))[0]

        if(!product){
            return res.status(404).json({error:'Product not found'})
        }

        const {image,name,price,type,description,discount}=req.body

        if(image){
            product.image=image
        }

        if(name){
            product.name=name
        }

        if(price){
            product.price=price
        }

        if(type){
            product.type=type
        }

        if(description){
            product.description=description
        }

        if(discount){
            product.discount=discount.toFixed(2)
        }

        const set=` image = '${product.image}' , name = '${product.name}' , price = '${product.price}' , type = '${product.type}' , description = '${product.description}' , discount = ${product.discount}`
        
        await update('products',set,conditionId)
        
        return res.status(200).json(product)

    } catch (error) {
        console.log(error)
        return res.status(500).json({error:'Internal error'})
    }
}

async function deleteProduct(req,res){

    try {
        const reqUser=req.user
    
        if(!reqUser.admin){
            return res.status(401).json({error:'Administrators only'})
        }

        const {id}=req.params

        const conditionId=`id = '${id}'`
        
        const product=(await select('products',['image','name','price','type','description'],conditionId))[0]

        if(!product){
            await res.status(404).json({error:'Product not found'})
        }
    
        await deleteLine('products',conditionId)

        const conditionIdProduct=`id_product = '${id}'`

        await deleteLine('comments',conditionIdProduct)
    
        return res.status(200).json(product)
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:'Internal error'})
    }

}

async function getProducts(req,res){
    try {
        const products=await select('products',['id','discount','image','name','price','type'])

        return res.status(200).json(products)

    } catch (error) {
        console.log(error)
        return res.status(500).json({error:'Internal error'})
    }
}

async function getProduct(req,res){
    try {

        const {id}=req.params

        const conditionId=`id = '${id}'`

        const product=(await select('products',['id','discount','image','name','price','type','description'],conditionId))[0]
   
        return res.status(200).json(product)

    } catch (error) {
        console.log(error)
        return res.status(500).json({error:'Internal error'})
    }
}

async function filterProducts(req,res){
    try {

        const {type}=req.params

        const conditionType=`type = '${type}'`

        const products=await select('products',['id','discount','image','name','price','type'],conditionType)

        return res.status(200).json(products)

    } catch (error) {
        console.log(error)
        return res.status(500).json({error:'Internal error'})
    }
}


const productsControllers={
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    getProducts,
    filterProducts
}

module.exports=productsControllers



