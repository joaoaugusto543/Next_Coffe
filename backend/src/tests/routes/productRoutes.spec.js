const request=require('supertest')
const app=require('../../app')
const { select, insert, deleteLine } = require('../../config/db')
const { encryptPassword } = require('../../services/cryptography')
const { v4: uuidv4 } = require('uuid')
const baseUrl='/api/products'

describe('ProductRoutes',()=>{

    async function createProduct(id){

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

    it('Create product',async ()=>{

        const {email,id:idUser}=await createUser('Admin_fsbfhf@gmail.com',true)

        const token=await login(email,'1234567')

        const newProduct={
            name:'café',
            price:'2.00',
            description:'sim',
            image:'https://images.unsplash.com/photo-1694807865565-70252084fa27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1886&q=80',
            type:'bebida',
            discount:null
        }

        const res=await request(app).post(`${baseUrl}/`).send(newProduct).set('Authorization',token)

        const {id}=res.body

        const conditionId=`id = '${id}'`

        const product=(await select('products',['name','price'],conditionId))[0]

        await deleteProduct(id)
        await deleteUser(idUser)

        expect(product.name).toBe(newProduct.name)
        expect(product.price).toBe(newProduct.price)
    })

    it('Administrators only / create product',async ()=>{

        const {email,id}=await createUser('Admin_fdsjbhgbdf@gmail.com',false)

        const token=await login(email,'1234567')

        const newProduct={
            name:'café',
            price:'2.00',
            description:'sim',
            image:'https://images.unsplash.com/photo-1694807865565-70252084fa27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1886&q=80',
            type:'bebida',
            discount:null
        }

        const res=await request(app).post(`${baseUrl}/`).send(newProduct).set('Authorization',token)

        await deleteUser(id)

        const {error}=res.body

        expect(error).toBe('Administrators only')
    })

    it('Update product',async ()=>{

        const {email,id:idUser}=await createUser('Admin_vwadgtwvdy@gmail.com',true)

        const token=await login(email,'1234567')

        const {id,name}=await createProduct()

        const update={
            name:'Café expresso'
        }

        await request(app).put(`${baseUrl}/${id}`).send(update).set('Authorization',token)

        const conditionId=`id = '${id}'`

        const product=(await select('products',['name','id'],conditionId))[0]

        await deleteProduct(id)
        await deleteUser(idUser)

        expect(product.id).toBe(id)
        expect(product.name).not.toBe(name)
        expect(product.name).toBe(update.name)
    })

    it('Administrators only / update product',async ()=>{

        const {email,id:idUser}=await createUser('Admin_vwadgdsfdd@gmail.com',false)

        const token=await login(email,'1234567')

        const {id}=await createProduct()

        const update={
            name:'Café expresso'
        }

        const res=await request(app).put(`${baseUrl}/${id}`).send(update).set('Authorization',token)

        const {error}=res.body

        await deleteProduct(id)
        await deleteUser(idUser)

        expect(error).toBe('Administrators only')
    })

    it('Product not found / update product',async ()=>{

        const {email,id:idUser}=await createUser('Admin_vwjsfdbfsyhdb@gmail.com',true)

        const token=await login(email,'1234567')

        const update={
            image:'https://images.unsplash.com/photo-1683009427660-b38dea9e8488?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
        }

        const res=await request(app).put(`${baseUrl}/387346432`).set('Authorization',token)

        const {error}=res.body

        await deleteUser(idUser)

        expect(error).toBe('Product not found')
    })

    it('Delete product',async ()=>{

        const {email,id:idUser}=await createUser('Admin_vwaddhve@gmail.com',true)

        const token=await login(email,'1234567')

        const {id}=await createProduct()

        await request(app).delete(`${baseUrl}/${id}`).set('Authorization',token)

        const conditionId=`id = '${id}'`

        const product=(await select('products',['name','id'],conditionId))[0]

        await deleteUser(idUser)

        expect(product).toBeUndefined()
    })

    it('Product not found / delete product',async ()=>{

        const {email,id:idUser}=await createUser('Admin_vwaddhve@gmail.com',true)

        const token=await login(email,'1234567')

        const res=await request(app).delete(`${baseUrl}/34243234`).set('Authorization',token)

        const {error}=res.body

        await deleteUser(idUser)

        expect(error).toBe('Product not found')
    })

    it('Get products',async ()=>{
        
        const {id:idOne}=await createProduct()
        const {id:idTwo}=await createProduct()

        const res=await request(app).get(`${baseUrl}/`)

        const products=res.body

        await deleteProduct(idOne)
        await deleteProduct(idTwo)

        expect(Array.isArray(products)).toBeTruthy()
    })

    it('Get product',async ()=>{
        
        const {id}=await createProduct()

        const res=await request(app).get(`${baseUrl}/${id}`)

        const product=res.body

        await deleteProduct(id)

        expect(product.id).toBe(id)
    })

    it('Filter products',async ()=>{
        
        const {type,id}=await createProduct()

        const res=await request(app).get(`${baseUrl}/filter/${type}`)

        const filteredProducts=res.body

        const manyDifferent=filteredProducts.filter((product)=>product.type !== type)

        await deleteProduct(id)

        expect(manyDifferent).toHaveLength(0)
    })
})