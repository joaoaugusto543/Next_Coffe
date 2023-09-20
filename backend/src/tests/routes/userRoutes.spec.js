const request=require('supertest')
const app=require('../../app')
const { select, insert, deleteLine } = require('../../config/db')
const { encryptPassword } = require('../../services/cryptography')
const { v4: uuidv4 } = require('uuid')

const baseUrl='/api/users'

describe('userRoutes',()=>{

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

    it('CreateUser',async ()=>{

        const newUser={
            email:'test@gmail.com',
            image:'avatarFive.png',
            name:'Test',
            password:'1234567',
            confirmPassword:'1234567'
        }

        await request(app).post(`${baseUrl}/`).send(newUser)

        const conditionEmail=`email = '${newUser.email}'`

        const user=(await select('users',['email','id'],conditionEmail))[0]

        await deleteUser(user.id)

        expect(newUser.email).toBe(user.email)

    })

    it('User already exists / createUser',async ()=>{

        const newUser={
            id:'637326',
            email:'test@gmail.com',
            image:'avatarFive.png',
            name:'Test',
            password:'1234567'
        }

        await insert('users',newUser)

        const copyUser={
            email:'test@gmail.com',
            image:'avatarFive.png',
            name:'Test',
            password:'1234567',
            confirmPassword:'1234567'
        }

        const res=await request(app).post(`${baseUrl}/`).send(copyUser)

        await deleteUser(newUser.id)

        const {error}=res.body

        expect(error).toBe('User already exists')

    })

    it('CreateUserAdmin',async ()=>{

        const {email,id}=await createUser('Admin_ronaldo@gmail.com',true)

        const token=await login(email,'1234567')

        const newUser={
            email:'admin_lucas@gmail.com',
            image:'avatarFive.png',
            name:'Test',
            password:'1234567',
            confirmPassword:'1234567'
        }

        await request(app).post(`${baseUrl}/createadmin`).send(newUser).set('Authorization',token)

        const conditionEmail=`email = '${newUser.email}'`

        const userAdmin=(await select('users',['email','admin','id'],conditionEmail))[0]

        await deleteUser(userAdmin.id)
        await deleteUser(id)

        expect(userAdmin.email).toBe(newUser.email)
        expect(userAdmin.admin).toBeTruthy()


    })

    it('Administrators only / createUserAdmin',async ()=>{

        const {email,id}=await createUser('Admin_marcao@gmail.com',false)

        const token=await login(email,'1234567')

        const newUser={
            email:'lucas@gmail.com',
            image:'avatarFive.png',
            name:'Test',
            password:'1234567',
            confirmPassword:'1234567'
        }

        const res=await request(app).post(`${baseUrl}/createadmin`).send(newUser).set('Authorization',token)

        const {error}=res.body

        await deleteUser(id)

        expect(error).toBe('Administrators only')
  
    })

    it('User already exists / createUserAdmin',async ()=>{

        const {email,id}=await createUser('Admin_lopes@gmail.com',true)

        const token=await login(email,'1234567')

        const newUser={
            email:'Admin_lopes@gmail.com',
            image:'avatarFive.png',
            name:'Test',
            password:'1234567',
            confirmPassword:'1234567'
        }

        const res=await request(app).post(`${baseUrl}/createadmin`).send(newUser).set('Authorization',token)

        const {error}=res.body

        await deleteUser(id)

        expect(error).toBe('User already exists')


    })

    it('updateUser',async ()=>{

        const {email,id,name}=await createUser('ronaldo@gmail.com',false)

        const token=await login(email,'1234567')

        const update={
            name:'mudado'
        }

        await request(app).put(`${baseUrl}/`).send(update).set('Authorization',token)

        const conditionEmail=`email = '${email}'`

        const user=(await select('users',['email','admin','id','name'],conditionEmail))[0]

        await deleteUser(user.id)
    
        expect(user.id).toBe(id)
        expect(user.name).not.toBe(name)
        expect(user.name).toBe('mudado')

    })

    it('DeleteUser',async ()=>{

        const {email,id}=await createUser('pedro@gmail.com',false)

        const token=await login(email,'1234567')

        await request(app).delete(`${baseUrl}/${id}`).set('Authorization',token)

        const conditionEmail=`email = '${email}'`

        const user=(await select('users',['id'],conditionEmail))[0]
  
        expect(user).toBeUndefined()
 

    })

    it('Users cannot delete accounts / deleteUser',async ()=>{

        const userAuth=await createUser('pedro@gmail.com',false)

        const token=await login(userAuth.email,'1234567')

        const {email,id}=await createUser('gugdautad@gmail.com',false)

        const res=await request(app).delete(`${baseUrl}/${id}`).set('Authorization',token)

        const conditionEmail=`email = '${email}'`

        const user=(await select('users',['id'],conditionEmail))[0]

        const {error}=res.body

        await deleteUser(user.id)
        await deleteUser(userAuth.id)
  
        expect(user).toBeDefined()
        expect(error).toBe('Users cannot delete accounts')

    })

    it('Admin users can delete any account / deleteUser',async ()=>{

        const userAuth=await createUser('admin_pedro@gmail.com',true)

        const token=await login(userAuth.email,'1234567')

        const {email,id}=await createUser('edbsda@gmail.com',false)

        await request(app).delete(`${baseUrl}/${id}`).set('Authorization',token)

        const conditionEmail=`email = '${email}'`

        const user=(await select('users',['id'],conditionEmail))[0]

        await deleteUser(userAuth.id)
  
        expect(user).toBeUndefined()

    })

    it('Profile',async ()=>{

        const {email,id}=await createUser('jairo@gmail.com',false)

        const token=await login(email,'1234567')

        const res=await request(app).get(`${baseUrl}/`).set('Authorization',token)

        const user=res.body

        await deleteUser(id)
  
        expect(user.id).toBe(id)
        expect(user.email).toBe(email)

    })

    it('AddToFavorites',async ()=>{

        const {id:idProduct}=await createProduct()

        const {email,id}=await createUser('jairooo@gmail.com',false)

        const token=await login(email,'1234567')

        await request(app).put(`${baseUrl}/${idProduct}`).set('Authorization',token)

        const conditionId=`id = '${id}'`

        const user=(await select('users',['favorites'],conditionId))[0]

        await deleteUser(id)
        await deleteProduct(idProduct)

        const {favorites}=user

        const favoritesJson=favorites.map((favorite)=>JSON.parse(favorite))

        const favorite=favoritesJson.find((favorite)=>favorite.id === idProduct)
  
        expect(favorite.id).toBe(idProduct)
    
    })

    it('Product not found / addToFavorites',async ()=>{

        const {email,id}=await createUser('lopeees@gmail.com',false)

        const token=await login(email,'1234567')

        const res=await request(app).put(`${baseUrl}/343624`).set('Authorization',token)

        await deleteUser(id)

        const {error}=res.body

        expect(error).toBe('Product not found')
   
    })

    it('Was once a favorite / addToFavorites',async ()=>{

        const {id:idProduct}=await createProduct()

        const {email,id}=await createUser('jairooo@gmail.com',false)

        const token=await login(email,'1234567')

        await request(app).put(`${baseUrl}/${idProduct}`).set('Authorization',token)

        const res=await request(app).put(`${baseUrl}/${idProduct}`).set('Authorization',token)

        const {error}=res.body

        await deleteUser(id)
        await deleteProduct(idProduct)
    
        expect(error).toBe('Was once a favorite')
    })

    it('RemoveToFavorites',async ()=>{

        const {id:idProduct}=await createProduct()

        const {email,id}=await createUser('remove@gmail.com',false)

        const token=await login(email,'1234567')

        await request(app).put(`${baseUrl}/${idProduct}`).set('Authorization',token)

        await request(app).put(`${baseUrl}/remove/${idProduct}`).set('Authorization',token)

        const conditionId=`id = '${id}'`

        const user=(await select('users',['favorites'],conditionId))[0]

        await deleteUser(id)
        await deleteProduct(idProduct)

        const {favorites}=user

        const favoritesJson=favorites.map((favorite)=>JSON.parse(favorite))

        const favorite=favoritesJson.find((favorite)=>favorite.id === idProduct)
  
        expect(favorite).toBeUndefined()
    
    })

    it('Product not found / RemoveToFavorites',async ()=>{

        const {email,id}=await createUser('maicon@gmail.com',false)

        const token=await login(email,'1234567')

        const res=await request(app).put(`${baseUrl}/remove/3543342`).set('Authorization',token)

        const {error}=res.body

        await deleteUser(id)
    
        expect(error).toBe('Product not found')
    
    })
})