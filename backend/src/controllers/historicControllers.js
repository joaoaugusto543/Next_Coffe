const { select, insert, update, deleteLine } = require("../config/db")
const { v4: uuidv4 } = require('uuid')

async function addProduct(req,res){

    try {
        const {idProduct}=req.params
    
        const {amount}=req.body
    
        if(!amount || amount<=0){
            return res.status(500).json({error:'Invalid amount'})
        }
    
        const conditionIdProduct=`id = '${idProduct}'`
    
        const product=(await select('products',['id','name','image','discount','price'],conditionIdProduct))[0]
    
        if(!product){
            return res.status(200).json({error:'Product not found'})
        }
    
        const user=req.user
    
        if(!user){
            return res.status(200).json({error:'User not found'})
        }
    
        const conditionIdUser=`id_user = '${user.id}'`
    
        const historics=(await select('historic',['products','open','id'],conditionIdUser))
    
        const historicOpen=historics.find((historic)=> historic.open === true)
    
        if(!historicOpen){
            const newHistoric={
                id:uuidv4(),
                id_user:user.id,
                products:[
                    JSON.stringify({...product,amount})
                ]
            }
    
            await insert('historic',newHistoric)
    
            const productsJson=newHistoric.products.map((product)=>JSON.parse(product))
    
            return res.status(200).json({...newHistoric,open:true,products:productsJson})
        }
    
        const productsJson=historicOpen.products.map((product)=>{
            return JSON.parse(product)
        })
    
        const repeatedProduct=productsJson.find((product)=>product.id === idProduct)
    
        if(repeatedProduct){
            return res.status(500).json({error:'Already included'})
        }
    
        const products=historicOpen.products.map((product)=>{
            return "'" + product + "'"
        })
    
        const newProducts=[...products, "'" + JSON.stringify({...product,amount}) + "'"]
    
        const set=` products = array [${newProducts}]`
    
        const conditionId=`id = '${historicOpen.id}'`
    
        await update('historic',set,conditionId)
    
        return res.status(200).json({newProducts})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:'Internal error'})
    }


}

async function removeProduct(req,res){
    try {

        const reqUser=req.user

       const {idProduct,idHistoric}=req.params
       
       const conditionId=`id = '${idHistoric}'`
       
       const historic=(await select('historic','*',conditionId))[0]
       
       if(!historic){
            return res.status(404).json({error:'Historic not found'})
       }

       if(reqUser.id !== historic.id_user){
            return res.status(401).json({error:'Not authorized'})
       }
   
       const productsJson=historic.products.map((product)=>JSON.parse(product))
       
       const product=productsJson.find((product)=>product.id===idProduct)

       if(!product){
            return res.status(404).json({error:'Product not found'}) 
       }

       const filteredProducts=productsJson.filter((product)=>product.id !== idProduct)

       const productsString=filteredProducts.map((product)=>"'" + JSON.stringify(product) + "'")

       if(productsString.length !== 0){

           const set=` products = array [${productsString}]`
           await update('historic',set,conditionId)

       }else{

         const set=` products = '{}'`

         await update('historic',set,conditionId) 
       }

       return res.status(200).json({filteredProducts})
       
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:'Internal error'})
    }
}

async function deleteHistoric(req,res){
    try {

        const reqUser=req.user

        const {id}=req.params

        const conditionId=`id = '${id}'`

        const historic=(await select('historic',['id','id_user'],conditionId))[0]

        if(!historic){
            return res.status(404).json({error:'Historic not found'})
        }

        if(reqUser.id !== historic.id_user){
            return res.status(401).json({error:'Not authorized'})
        }

        await deleteLine('historic',conditionId)

        return res.status(200).json(historic)
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:'Internal error'})
    }
}

async function clearHistoric(req,res){
    try {
        const reqUser=req.user

        if(!reqUser){
            return res.status(404).json({error:'User not found'})
        }

        const conditionIdUser=`id_user = '${reqUser.id}'`

        const historics=(await select('historic',['id'],conditionIdUser))

        if(historics.length===0){
            return res.status(500).json({error:'Historic clean'})
        }

        await deleteLine('historic',conditionIdUser)

        return res.status(200).json(historics)

    } catch (error) {
        console.log(error)
        return res.status(500).json({error:'Internal error'})
    }
}

async function getHistoric(req,res){
    try {

        const {id:idUser}=req.user

        const {id}=req.params

        const conditionId=`id = '${id}'`

        const historic=(await select('historic','*',conditionId))[0]

        if(!historic){
            return res.status(404).json({error:'Historic not found'})
        }

        if(historic.id_user !== idUser){
            return res.status(401).json({error:'Not authorized'})
        }

        return res.status(200).json(historic)
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:'Internal error'})
    }
}

async function getHistorics(req,res){
    try {

        const {id}=req.user

        const conditionIdUser=`id_user = '${id}'`

        const historic=(await select('historic','*',conditionIdUser))

        if(!historic){
            return res.status(404).json({error:'Historic not found'})
        }

        return res.status(200).json(historic)
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:'Internal error'})
    }
}

async function closeHistoric(req,res){
    try {

        const {id:idUser}=req.user

        const {id}=req.params

        const conditionId=`id = '${id}'`

        const historic=(await select('historic','*',conditionId))[0]

        if(!historic){
            return res.status(404).json({error:'Historic not found'})
        }

        if(historic.id_user !== idUser){
            return res.status(401).json({error:'Not authorized'})
        }

        if(!historic.open){
            return res.status(500).json({error:'Already closed'})
        }

        historic.open=false

        const set=` open = 'false'`

        await update('historic',set,conditionId)

        return res.status(200).json(historic)

    } catch (error) {
        console.log(error)
        return res.status(500).json({error:'Internal error'}) 
    }
}

const historicControllers={
    addProduct,
    removeProduct,
    deleteHistoric,
    clearHistoric,
    getHistoric,
    getHistorics,
    closeHistoric
}

module.exports=historicControllers