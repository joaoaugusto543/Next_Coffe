import { baseUrl } from '@/app/api/api'

export async function getComments(idProduct){
    const requeste=await fetch(`${baseUrl}/api/comment/${idProduct}`,{cache:'no-cache'})
    const comments=await requeste.json()
    return comments
}