import { baseUrl } from '@/app/api/api'

export async function createSession(email,password){

    try {
        const response=await fetch(`${baseUrl}/api/session/`, {
            method: 'POST',
            body: JSON.stringify({
                email:email,
                password:password
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    
        const session=await response.json()

        return session
        
    } catch (error) {
       return error
        
    }

}

