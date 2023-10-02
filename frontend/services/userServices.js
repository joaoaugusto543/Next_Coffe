import { baseUrl } from '@/app/api/api'

export async function createUser(newUser){
    const response=await fetch(`${baseUrl}/api/users/`, {
        method: 'POST',
        body: JSON.stringify(newUser),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const user=await response.json()

    return user
}

