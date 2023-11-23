const request=require('supertest')
const app=require('../../app')
const { select, insert, deleteLine } = require('../../config/db')
const { encryptPassword } = require('../../services/cryptography')
const { v4: uuidv4 } = require('uuid')

const baseUrl='/api/users'

describe('userRoutes',()=>{

    async function deleteUser(id){

        await deleteLine('users',`id = '${id}'`)
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

    it('ValidationCreateUser',async ()=>{

        const newUser={
            email:'',
            image:'avatarFivee.png',
            name:'T'
        }

        const res=await request(app).post(`${baseUrl}/`).send(newUser)

        const {errors}=res.body

        expect(Array.isArray(errors)).toBeTruthy()
        expect(errors).toHaveLength(5)

    })

    it('ValidationUpdateUser',async ()=>{

        const {email,id}=await createUser('ronaldo@gmail.com',false)

        const token=await login(email,'1234567')

        const update={
            email:'',
            image:'avatarFivee.png',
            name:'T'
        }

        const res=await request(app).put(`${baseUrl}/`).send(update).set('Authorization',token)

        const {errors}=res.body

        await deleteUser(id)
    
        expect(Array.isArray(errors)).toBeTruthy()
        expect(errors).toHaveLength(2)

    })
})
