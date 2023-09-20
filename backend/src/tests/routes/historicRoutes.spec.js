const request=require('supertest')
const app=require('../../app')
const { select, insert, deleteLine } = require('../../config/db')
const { encryptPassword } = require('../../services/cryptography')
const { v4: uuidv4 } = require('uuid')

const baseUrl='/api/historic'

describe('historicRoutes',()=>{

    async function deleteHistoric(id){
        await deleteLine('historic',`id = '${id}'`)
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


    it('AddProduct (historic close)',async ()=>{

        const {id:idProduct}=await createProduct()

        const {email,id:idUser}=await createUser('dbdddasg@gmail.com',false)

        const token=await login(email,'1234567')

        const newHistoric={
            amount:2
        }

        const res=await request(app).put(`${baseUrl}/${idProduct}`).send(newHistoric).set('Authorization',token)

        const {id}=res.body

        const conditionId=`id = '${id}'`

        const historic=(await select('historic',['products'],conditionId))[0]

        await deleteHistoric(id)
        await deleteProduct(idProduct)
        await deleteUser(idUser)
        
        expect(historic.products).toHaveLength(1)
    })

    it('AddProduct (historic open)',async ()=>{

        const {id:idProductOne}=await createProduct()
        const {id:idProductTwo}=await createProduct()

        const {email,id:idUser}=await createUser('ncjhbdsgc@gmail.com',false)

        const token=await login(email,'1234567')

        const newHistoric={
            amount:2
        }

        await request(app).put(`${baseUrl}/${idProductOne}`).send(newHistoric).set('Authorization',token)
        await request(app).put(`${baseUrl}/${idProductTwo}`).send(newHistoric).set('Authorization',token)

        const conditionIdUser=`id_user = '${idUser}'`

        const historic=(await select('historic',['products','id'],conditionIdUser))[0]

        await deleteHistoric(historic.id)
        await deleteProduct(idProductOne)
        await deleteProduct(idProductTwo)
        await deleteUser(idUser)
        
        expect(historic.products).toHaveLength(2)
    })

    it('Invalid amount / addProduct',async ()=>{

        const {id:idProduct}=await createProduct()

        const {email,id:idUser}=await createUser('mswjqdgy@gmail.com',false)

        const token=await login(email,'1234567')

        const newHistoric={
            amount:-2
        }

        const res=await request(app).put(`${baseUrl}/${idProduct}`).send(newHistoric).set('Authorization',token)

        const {error}=res.body

        await deleteProduct(idProduct)
        await deleteUser(idUser)
        
        expect(error).toBe('Invalid amount')
    })

    it('Product not found / addProduct',async ()=>{

        const {email,id:idUser}=await createUser('loiqhdyuqwgvywd@gmail.com',false)

        const token=await login(email,'1234567')

        const newHistoric={
            amount:2
        }

        const res=await request(app).put(`${baseUrl}/231232`).send(newHistoric).set('Authorization',token)

        const {error}=res.body

        await deleteUser(idUser)
        
        expect(error).toBe('Product not found')
    })

    it('Already included / addProduct',async ()=>{

        const {id:idProduct}=await createProduct()
        
        const {email,id:idUser}=await createUser('dcsncdsucdcdaq3wswd@gmail.com',false)

        const token=await login(email,'1234567')

        const newHistoric={
            amount:2
        }

        await request(app).put(`${baseUrl}/${idProduct}`).send(newHistoric).set('Authorization',token)
        const res=await request(app).put(`${baseUrl}/${idProduct}`).send(newHistoric).set('Authorization',token)

        const {error}=res.body

        const conditionIdUser=`id_user = '${idUser}'`

        const historic=(await select('historic',['products','id'],conditionIdUser))[0]

        await deleteHistoric(historic.id)
        await deleteProduct(idProduct)
        await deleteUser(idUser)
        
        expect(error).toBe('Already included')
    })

    it('RemoveProduct (historic with one product)',async ()=>{

        const {id:idProduct}=await createProduct()

        const {email,id:idUser}=await createUser('jbacueawwe@gmail.com',false)

        const token=await login(email,'1234567')

        const newHistoric={
            amount:2
        }

        const res=await request(app).put(`${baseUrl}/${idProduct}`).send(newHistoric).set('Authorization',token)

        const {id}=res.body

        await request(app).put(`${baseUrl}/${id}/${idProduct}`).set('Authorization',token)

        const conditionId=`id = '${id}'`

        const historic=(await select('historic',['products'],conditionId))[0]

        await deleteHistoric(id)
        await deleteProduct(idProduct)
        await deleteUser(idUser)
        
        expect(historic.products).toHaveLength(0)
    })

    it('RemoveProduct (historic more than one product)',async ()=>{

        const {id:idProductOne}=await createProduct()
        const {id:idProductTwo}=await createProduct()

        const {email,id:idUser}=await createUser('lihdfbduyqw@gmail.com',false)

        const token=await login(email,'1234567')

        const newHistoric={
            amount:2
        }

        const res=await request(app).put(`${baseUrl}/${idProductOne}`).send(newHistoric).set('Authorization',token)
        await request(app).put(`${baseUrl}/${idProductTwo}`).send(newHistoric).set('Authorization',token)

        const {id}=res.body

        await request(app).put(`${baseUrl}/${id}/${idProductTwo}`).set('Authorization',token)

        const conditionId=`id = '${id}'`

        const historic=(await select('historic',['products'],conditionId))[0]

        await deleteHistoric(id)
        await deleteProduct(idProductOne)
        await deleteProduct(idProductTwo)
        await deleteUser(idUser)
        
        expect(historic.products).toHaveLength(1)
    })

    it('Historic not found / removeProduct',async ()=>{

        const {id:idProduct}=await createProduct()

        const {email,id:idUser}=await createUser('buysdagtqw@gmail.com',false)

        const token=await login(email,'1234567')

        const res=await request(app).put(`${baseUrl}/21683513/${idProduct}`).set('Authorization',token)

        const {error}=res.body

        await deleteProduct(idProduct)
        await deleteUser(idUser)
        
        expect(error).toBe('Historic not found')
    })

    it('Not authorized / removeProduct',async ()=>{

        const {id:idProduct}=await createProduct()

        const {id:idUser,email}=await createUser('mdejinwhebe@gmail.com',false)

        const tokenUserCreatingProduct=await login(email,'1234567')

        const user=await createUser('nsqhubfqew@gmail.com',true)

        const tokenUserRemovingProduct=await login(user.email,'1234567')

        const newHistoric={
            amount:2
        }

        const resCreate=await request(app).put(`${baseUrl}/${idProduct}`).send(newHistoric).set('Authorization',tokenUserCreatingProduct)

        const {id}=resCreate.body

        const res=await request(app).put(`${baseUrl}/${id}/${idProduct}`).set('Authorization',tokenUserRemovingProduct)

        const {error}=res.body

        const conditionIdUser=`id_user = '${idUser}'`

        const historic=(await select('historic',['products','id'],conditionIdUser))[0]

        await deleteHistoric(historic.id)
        await deleteProduct(idProduct)
        await deleteUser(idUser)
        await deleteUser(user.id)
        
        expect(error).toBe('Not authorized')
    })

    it('CloseHistoric',async ()=>{

        const {id:idProduct}=await createProduct()
        
        const {email,id:idUser}=await createUser('dbcbdrbrhdh@gmail.com',false)

        const token=await login(email,'1234567')

        const newHistoric={
            amount:2
        }

        const resHistoricOne=await request(app).put(`${baseUrl}/${idProduct}`).send(newHistoric).set('Authorization',token)

        const {id:idHistoricOne}=resHistoricOne.body

        await request(app).put(`${baseUrl}/open/close/${idHistoricOne}`).set('Authorization',token)

        const resHistoricTwo=await request(app).put(`${baseUrl}/${idProduct}`).send(newHistoric).set('Authorization',token)

        const {id:idHistoricTwo}=resHistoricTwo.body

        const conditionIdUser=`id_user = '${idUser}'`

        const historics=await select('historic',['products','id'],conditionIdUser)

        await deleteHistoric(idHistoricOne)
        await deleteHistoric(idHistoricTwo)
        await deleteProduct(idProduct)
        await deleteUser(idUser)
        
        expect(idHistoricOne).not.toBe(idHistoricTwo)
        expect(historics).toHaveLength(2)
    })

    it('Historic not found / closeHistoric',async ()=>{

        const {id:idProduct}=await createProduct()
        
        const {email,id:idUser}=await createUser('dcsncdsucdcdaq3wr@gmail.com',false)

        const token=await login(email,'1234567')
    
        const res=await request(app).put(`${baseUrl}/open/close/342346`).set('Authorization',token)

        const {error}=res.body

        await deleteProduct(idProduct)
        await deleteUser(idUser)
        
        expect(error).toBe('Historic not found')
    })

    it('Not authorized / closeHistoric',async ()=>{

        const {id:idProduct}=await createProduct()
        
        const {email,id:idUser}=await createUser('sasdhqgwy@gmail.com',false)

        const otherUser=await createUser('dbhyuwcdyh@gmail.com',false)

        const tokenOtherUser=await login(otherUser.email,'1234567')

        const token=await login(email,'1234567')

        const newHistoric={
            amount:2
        }

        const resHistoric=await request(app).put(`${baseUrl}/${idProduct}`).send(newHistoric).set('Authorization',token)

        const {id}=resHistoric.body

        const res=await request(app).put(`${baseUrl}/open/close/${id}`).set('Authorization',tokenOtherUser)

        const {error}=res.body

        await deleteHistoric(id)
        await deleteProduct(idProduct)
        await deleteUser(idUser)
        await deleteUser(otherUser.id)
        
        expect(error).toBe('Not authorized')
        
    })

    it('Already closed / closeHistoric',async ()=>{

        const {id:idProduct}=await createProduct()
        
        const {email,id:idUser}=await createUser('lnhdhygdewyuew@gmail.com',false)

        const token=await login(email,'1234567')

        const newHistoric={
            amount:2
        }

        const resHistoric=await request(app).put(`${baseUrl}/${idProduct}`).send(newHistoric).set('Authorization',token)

        const {id}=resHistoric.body

        await request(app).put(`${baseUrl}/open/close/${id}`).set('Authorization',token)

        const res=await request(app).put(`${baseUrl}/open/close/${id}`).set('Authorization',token)

        const {error}=res.body

        await deleteHistoric(id)
        await deleteProduct(idProduct)
        await deleteUser(idUser)
        
        expect(error).toBe('Already closed')

    })

    it('ClearHistoric',async ()=>{

        const {id:idProduct}=await createProduct()
        
        const {email,id:idUser}=await createUser('lijwwhded@gmail.com',false)

        const token=await login(email,'1234567')

        const newHistoric={
            amount:2
        }

        const resHistoric=await request(app).put(`${baseUrl}/${idProduct}`).send(newHistoric).set('Authorization',token)

        const {id}=resHistoric.body

        await request(app).put(`${baseUrl}/open/close/${id}`).set('Authorization',token)

        await request(app).put(`${baseUrl}/${idProduct}`).send(newHistoric).set('Authorization',token)

        const conditionIdUser=`id_user = '${idUser}'`

        const historicsBefore=await select('historic',['products','id'],conditionIdUser)

        expect(historicsBefore).toHaveLength(2)

        await request(app).delete(`${baseUrl}/`).set('Authorization',token)

        const historicsNow=await select('historic',['products','id'],conditionIdUser)

        await deleteProduct(idProduct)
        await deleteUser(idUser)
        
        expect(historicsNow).toHaveLength(0)
    })

    it('Historic clean / clearHistoric',async ()=>{

        const {id:idProduct}=await createProduct()
        
        const {email,id:idUser}=await createUser('hxgudetwvf@gmail.com',false)

        const token=await login(email,'1234567')

        const newHistoric={
            amount:2
        }

        await request(app).put(`${baseUrl}/${idProduct}`).send(newHistoric).set('Authorization',token)

        await request(app).delete(`${baseUrl}/`).set('Authorization',token)

        const res=await request(app).delete(`${baseUrl}/`).set('Authorization',token)

        const {error}=res.body
        
        await deleteProduct(idProduct)
        await deleteUser(idUser)
        
        expect(error).toBe('Historic clean')
    })

    it('DeleteHistoric',async ()=>{

        const {id:idProduct}=await createProduct()
        
        const {email,id:idUser}=await createUser('hxgudetefeewf@gmail.com',false)

        const token=await login(email,'1234567')

        const newHistoric={
            amount:2
        }

        const res=await request(app).put(`${baseUrl}/${idProduct}`).send(newHistoric).set('Authorization',token)

        const {id}=res.body

        await request(app).delete(`${baseUrl}/${id}`).set('Authorization',token)

        await deleteProduct(idProduct)
        await deleteUser(idUser)

        const conditionIdUser=`id_user = '${idUser}'`

        const historics=await select('historic',['products','id'],conditionIdUser)

        expect(historics).toHaveLength(0)
    })

    it('Historic not found / deleteHistoric',async ()=>{

        const {id:idProduct}=await createProduct()
        
        const {email,id:idUser}=await createUser('hwgveydeyedvevdy@gmail.com',false)

        const token=await login(email,'1234567')

        const res=await request(app).delete(`${baseUrl}/234473`).set('Authorization',token)

        const {error}=res.body

        await deleteProduct(idProduct)
        await deleteUser(idUser)

        expect(error).toBe('Historic not found')
    })

    it('Not authorized / deleteHistoric',async ()=>{

        const {id:idProduct}=await createProduct()
        
        const {email,id:idUser}=await createUser('pnduce@gmail.com',false)

        const otherUser=await createUser('tbwcdehcwe@gmail.com',false)

        const tokenOtherUser=await login(otherUser.email,'1234567')

        const token=await login(email,'1234567')

        const newHistoric={
            amount:2
        }

        const resHistoric=await request(app).put(`${baseUrl}/${idProduct}`).send(newHistoric).set('Authorization',token)

        const {id}=resHistoric.body

        const res=await request(app).delete(`${baseUrl}/${id}`).set('Authorization',tokenOtherUser)

        const {error}=res.body

        await deleteHistoric(id)
        await deleteProduct(idProduct)
        await deleteUser(idUser)
        await deleteUser(otherUser.id)
        
        expect(error).toBe('Not authorized')
        
    })

    it('GetHistorics',async ()=>{
        
        const {email,id:idUser}=await createUser('pnduce@gmail.com',false)

        const token=await login(email,'1234567')

        const res=await request(app).get(`${baseUrl}/`).set('Authorization',token)

        const historics=res.body
        
        await deleteUser(idUser)

        expect(Array.isArray(historics)).toBeTruthy()

    })

    it('GetHistoric',async ()=>{

        const {id:idProduct}=await createProduct()
        
        const {email,id:idUser}=await createUser('pnduce@gmail.com',false)

        const token=await login(email,'1234567')

        const newHistoric={
            amount:2
        }

        const resHistoric=await request(app).put(`${baseUrl}/${idProduct}`).send(newHistoric).set('Authorization',token)

        const {id}=resHistoric.body

        const res=await request(app).get(`${baseUrl}/${id}`).set('Authorization',token)

        const historic=res.body

        await deleteHistoric(id)
        await deleteUser(idUser)
        await deleteProduct(idProduct)

        expect(historic.id_user).toBe(idUser)

    })

    it('Historic not found / getHistoric',async ()=>{

        const {email,id}=await createUser('dcbhegevlfj@gmail.com',false)

        const token=await login(email,'1234567')

        const res=await request(app).get(`${baseUrl}/34632478`).set('Authorization',token)

        const {error}=res.body

        await deleteUser(id)

        expect(error).toBe('Historic not found')

    })

    it('Not authorized / getHistoric',async ()=>{

        const {id:idProduct}=await createProduct()
        
        const {email,id:idUser}=await createUser('oidcyueccwe@gmail.com',false)

        const token=await login(email,'1234567')

        const otherUser=await createUser('hdhgvsde@gmail.com',false)

        const tokenOtherUser=await login(otherUser.email,'1234567')

        const newHistoric={
            amount:2
        }

        const resHistoric=await request(app).put(`${baseUrl}/${idProduct}`).send(newHistoric).set('Authorization',token)

        const {id}=resHistoric.body

        const res=await request(app).get(`${baseUrl}/${id}`).set('Authorization',tokenOtherUser)

        const {error}=res.body

        await deleteProduct(idProduct)
        await deleteHistoric(id)
        await deleteUser(idUser)
        await deleteUser(otherUser.id)

        expect(error).toBe('Not authorized')

    })

   
})
