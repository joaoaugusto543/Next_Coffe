const request=require('supertest')
const app=require('../../app')
const { insert, deleteLine } = require('../../config/db')
const { encryptPassword } = require('../../services/cryptography')
const { v4: uuidv4 } = require('uuid')

const baseUrl='/api/comment'

describe('CommentValidation',()=>{
    
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

    it('ValidationCreateComment',async ()=>{

        const {id:idProduct}=await createProduct()

        const {email,id}=await createUser('fndubfrdcndh@gmail.com',false)

        const token=await login(email,'1234567')

        const newComment={
            comment:'',
            assessment:4.5
        }

        const res=await request(app).post(`${baseUrl}/${idProduct}`).send(newComment).set('Authorization',token)

        const {errors}=res.body

        await deleteUser(id)
        await deleteProduct(idProduct)

        expect(Array.isArray(errors)).toBeTruthy()
        expect(errors).toHaveLength(2)
    })
})