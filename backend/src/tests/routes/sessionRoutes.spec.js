const { insert, deleteLine } = require('../../config/db')
const app = require('../../app')
const request=require('supertest')
const { encryptPassword } = require('../../services/cryptography')
const { v4: uuidv4 } = require('uuid')

describe('SessionsRoutes',()=>{

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

    async function deleteUser(id){
        await deleteLine('users',`id = '${id}'`)
    }
    
    it('Create session',async ()=>{
        
        const {email,id}=await createUser('lopeees@gmail.com',false)
       
        const res=await request(app).post('/api/session/').send({email,password:'1234567'})

        await deleteUser(id)

        const body=res.body

        expect(body).toHaveProperty('user')
        expect(body).toHaveProperty('token')
      
    })

    it('Error user / password invalid create session',async ()=>{
       
        const {email,id}=await createUser('lopeees@gmail.com',false)
       
        const res=await request(app).post('/api/session/').send({email,password:'12345'})

        const {authenticationError}=res.body

        await deleteUser(id)

        expect(authenticationError).toBe('user / password invalid')
      
    })
    
})