import { baseUrl } from '@/app/api/api'


export async function getComments(idProduct){
    try {
        const requeste=await fetch(`${baseUrl}/api/comment/${idProduct}`,{cache:'no-cache'})
        const comments=await requeste.json()
        return comments.reverse()
    } catch (error) {
        return error
        
    }
}

export async function createComment(idProduct,token,newComment){
    try {
        const requeste=await fetch(`${baseUrl}/api/comment/${idProduct}`,{
            method: 'POST',
            body:JSON.stringify(newComment),
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${token}`
            }
        })

        const comment=await requeste.json()

        return comment

    } catch (error) {
        return error
        
    }
}


export async function deleteComment(token,id){
    try {
        await fetch(`${baseUrl}/api/comment/${id}`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${token}`
            }
        })

        return 

    } catch (error) {
        return error
        
    }
}
