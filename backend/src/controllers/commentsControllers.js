const { select, insert, deleteLine } = require("../config/db")
const { v4: uuidv4 } = require('uuid')

async function createComment(req,res){
    try {

        const {idProduct}=req.params

        const {comment,assessment}=req.body

        const {id:idUser,image,name}=req.user

        const reqUser=req.user

        if(!reqUser){
            return res.status(404).json({error:'User not found'})
        }

        const conditionId=`id = '${idProduct}'`

        const product=(await select('products',['id'],conditionId))[0]

        if(!product){
            return res.status(404).json({error:'Product not found'})
        }

        const condition=`id_user = '${idUser}' AND id_product = '${idProduct}'`

        const comments=await select('comments',['id'],condition)

        if(comments.length >= 3){
            return res.status(500).json({error:'Comment limit reached'})
        }

        const newComment={
            id:uuidv4(),
            comment,
            assessment,
            image,
            name,
            id_product:idProduct,
            id_user:idUser
        }

        await insert('comments',newComment)

        return res.status(200).json(newComment)
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:'Internal error'})
    }
}

async function deleteComment(req,res){
    try {

        const {id:idUser,admin}=req.user

        const {id}=req.params

        const conditionId=`id = '${id}'`

        const comment=(await select('comments',['id','id_user'],conditionId))[0]

        if(!comment){
            return res.status(404).json({error:'Comment not found'})
        }

        if(comment.id_user !== idUser && !admin){
            return res.status(401).json({error:'Not authorized'})
        }

        await deleteLine('comments',conditionId)

        return res.status(200).json(comment)
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:'Internal error'})
    }
}

async function getComments(req,res){
    try {
        const {idProduct}=req.params

        const conditionIdProduct=`id_product = '${idProduct}'`

        const comments=(await select('comments','*',conditionIdProduct))

        return res.status(200).json(comments)

    } catch (error) {
        console.log(error)
        return res.status(500).json({error:'Internal error'})
    }
}

const commentsControllers={
    createComment,
    deleteComment,
    getComments
}

module.exports=commentsControllers