const app = require('../../app')
const request=require('supertest')

const baseUrl='/api/users'

describe('Auth',()=>{

    it('Token is not provided',async ()=>{
     
        const res=await request(app).get(`${baseUrl}/`)

        const {error}=res.body

        expect(error).toBe('Token was not provided')
      
    })

    it('Token is not provided',async ()=>{
     
        const res=await request(app).get(`${baseUrl}/`).set('Authorization','1233')

        const body=res.body

        expect(body).toHaveProperty('error')
        expect(body.error).toBe('Invalid token')
      
    })

})