const request=require('supertest')
const app=require('../../app')
const { select, insert, deleteLine } = require('../../config/db')
const { encryptPassword } = require('../../services/cryptography')
const { v4: uuidv4 } = require('uuid')

const baseUrl='/api/comment'

async function createComment(name,image,id_user,id_product){

    const newComment={
        id:uuidv4(),
        name,
        image,
        comment:'Top!!!',
        assessment:4,
        id_user,
        id_product
    }

    await insert('comments',newComment)

    return newComment
}

async function deleteComment(id){
    await deleteLine('comments',`id_user = '${id}'`)
}

async function createProduct(){

    const newProduct={
        id:uuidv4(),
        name:'café',
        price:'2.00',
        description:'sim',
        image:'https://images.unsplash.com/photo-1694807865565-70252084fa27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1886&q=80',
        type:'bebida',
        discount:null
    }

    await insert('products',newProduct)

    return newProduct

}

async function deleteUser(id){

    await deleteLine('users',`id = '${id}'`)
}

async function deleteProduct(id){

    await deleteLine('products',`id = '${id}'`)
}

async function createUser(email,admin){

    const newUser={
        id:uuidv4(),
        email,
        name:'Testtt',
        image:'avatarFive.png',
        password:await encryptPassword('1234567'),
        admin
    }

    await insert('users',newUser)

    return newUser
}

async function login(email,password){

    const res=await request(app).post('/api/session/').send({email,password})

    const token=`Bearer ${res.body.token}`

    return token
}

describe('commentRoutes',()=>{
    it('CreateComment',async ()=>{

        const {id:idProduct}=await createProduct()

        const {email,id}=await createUser('fndubfrdcndh@gmail.com',false)

        const token=await login(email,'1234567')

        const newComment={
            comment:'Top!!!',
            assessment:4
        }

        const res=await request(app).post(`${baseUrl}/${idProduct}`).send(newComment).set('Authorization',token)

        const comment=res.body

        await deleteComment(id)
        await deleteUser(id)
        await deleteProduct(idProduct)

        expect(comment.comment).toBe(newComment.comment)
        expect(comment.assessment).toBe(newComment.assessment)
        expect(comment.id_user).toBe(id)
        expect(comment.id_product).toBe(idProduct)

    })

    it('Product not found / createComment',async ()=>{


        const {email,id}=await createUser('deuwgewgdye@gmail.com',false)

        const token=await login(email,'1234567')

        const newComment={
            comment:'Top!!!',
            assessment:4
        }

        const res=await request(app).post(`${baseUrl}/3247432`).send(newComment).set('Authorization',token)

        const {error}=res.body

        await deleteUser(id)
  
        expect(error).toBe('Product not found')

    })

    it('Comment limit reached / createComment',async ()=>{

        const {id:idProduct}=await createProduct()

        const {email,id}=await createUser('fdsfaad@gmail.com',false)

        const token=await login(email,'1234567')

        const newComment={
            comment:'Top!!!',
            assessment:4
        }

        await request(app).post(`${baseUrl}/${idProduct}`).send(newComment).set('Authorization',token)
        await request(app).post(`${baseUrl}/${idProduct}`).send(newComment).set('Authorization',token)
        await request(app).post(`${baseUrl}/${idProduct}`).send(newComment).set('Authorization',token)
        const res=await request(app).post(`${baseUrl}/${idProduct}`).send(newComment).set('Authorization',token)

        const {error}=res.body

        await deleteComment(id)
        await deleteUser(id)
        await deleteProduct(idProduct)

        expect(error).toBe('Comment limit reached')

    })

    it('DeleteComment',async ()=>{

        const {id:idProduct}=await createProduct()

        const {email,id:idUser,name,image}=await createUser('ewrewrwe@gmail.com',false)

        const {id}=await createComment(name,image,idUser,idProduct)

        const token=await login(email,'1234567')

        await request(app).delete(`${baseUrl}/${id}`).set('Authorization',token)

        const conditionId=`id = '${id}'`
    
        const comment=(await select('comments',['id'],conditionId))[0]

        await deleteUser(idUser)
        await deleteProduct(idProduct)

        expect(comment).toBeUndefined()

    })

    it('DeleteComment',async ()=>{

        const {id:idProduct}=await createProduct()

        const {email,id:idUser,name,image}=await createUser('bhdyuewd@gmail.com',false)

        const {id}=await createComment(name,image,idUser,idProduct)

        const token=await login(email,'1234567')

        await request(app).delete(`${baseUrl}/${id}`).set('Authorization',token)

        const conditionId=`id = '${id}'`
    
        const comment=(await select('comments',['id'],conditionId))[0]

        await deleteUser(idUser)
        await deleteProduct(idProduct)

        expect(comment).toBeUndefined()

    })

    it('Comment not found / deleteComment',async ()=>{

        const {email,id}=await createUser('efsdfdesfe@gmail.com',false)

        const token=await login(email,'1234567')

        const res=await request(app).delete(`${baseUrl}/432532467`).set('Authorization',token)

        const {error}=res.body

        await deleteUser(id)
  
        expect(error).toBe('Comment not found')

    })

    it('Not authorized / deleteComment',async ()=>{

        const {id:idProduct}=await createProduct()

        const {id:idUser,name,image}=await createUser('sdniuafdfwbhdsb@gmail.com',false)

        const {id}=await createComment(name,image,idUser,idProduct)

        const user=await createUser('ndsnihucb@gmail.com',false)

        const token=await login(user.email,'1234567')

        const res=await request(app).delete(`${baseUrl}/${id}`).set('Authorization',token)

        const {error}=res.body

        await deleteComment(idUser)
        await deleteUser(idUser)
        await deleteUser(user.id)
        await deleteProduct(idProduct)

        expect(error).toBe('Not authorized')

    })

    it('Admin can delete any comment / deleteComment',async ()=>{

        const {id:idProduct}=await createProduct()

        const {id:idUser,name,image}=await createUser('dbuawsdvgvas@gmail.com',false)

        const {id}=await createComment(name,image,idUser,idProduct)

        const user=await createUser('admin_ndsnihucb@gmail.com',true)

        const token=await login(user.email,'1234567')

        await request(app).delete(`${baseUrl}/${id}`).set('Authorization',token)

        const conditionId=`id = '${id}'`
    
        const comment=(await select('comments',['id'],conditionId))[0]

        await deleteUser(idUser)
        await deleteUser(user.id)
        await deleteProduct(idProduct)

        expect(comment).toBeUndefined()

    })

    it('GetComments',async ()=>{

        const {id:idProduct}=await createProduct()

        const {id:idUser,name,image}=await createUser('dhsuhduhfsdhds@gmail.com',false)

        await createComment(name,image,idUser,idProduct)

        const res=await request(app).get(`${baseUrl}/${idProduct}`)

        const comments=res.body

        await deleteComment(idUser)
        await deleteUser(idUser)
        await deleteProduct(idProduct)

        expect(Array.isArray(comments)).toBeTruthy()

    })
})

