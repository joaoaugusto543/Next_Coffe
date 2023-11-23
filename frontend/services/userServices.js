import { baseUrl } from '@/app/api/api'
import {getProducts } from './productsServices'

export async function createUser(newUser){

    try {
        const response=await fetch(`${baseUrl}/api/users/`, {
            method: 'POST',
            body: JSON.stringify(newUser),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    
        const user=await response.json()
    
        return user
        
    } catch (error) {
        return error
    }
    
}

export async function profile(token){

    try {
        
        if(!token){
            return
        }
    
        const response=await fetch(`${baseUrl}/api/users/`, {
            cache:'no-cache',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${token}`
            }
        })
    
        const user=await response.json()
    
        return user
    } catch (error) {
        return error
    }

}

export async function addFavorites(token,idProduct){

    try {
        const response=await fetch(`${baseUrl}/api/users/${idProduct}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${token}`
            }
        })
    
        const data=await response.json()
    
        return data
        
    } catch (error) {
        return error
    }

}

export async function removeFavorites(token,idProduct){

    try {
        const response=await fetch(`${baseUrl}/api/users/remove/${idProduct}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${token}`
            }
        })
    
        const data=await response.json()
    
        return data
        
    } catch (error) {
        return error
    }

}

export async function getFavorites(user){

    try {
        const products=await getProducts()
    
        const favorites=user.favorites.map(favorite=>{
            const favoriteProduct=products.find(product => favorite.id === product.id)
    
            return favoriteProduct
        })
    
        return favorites
        
    } catch (error) {
        return error
    }

}

export async function updateUser(token,userUpdated){
    try {

        const request=await fetch(`${baseUrl}/api/users/`, {
            method: 'PUT',
            body:JSON.stringify(userUpdated),
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${token}`
            }
        })

        const res=await request.json()

        console.log(res)

        return res
        
    } catch (error) {
        return error
    }
}

export async function createUserAdmin(newUserAdmin,token){

    try {
        const response=await fetch(`${baseUrl}/api/users/createadmin`, {
            method: 'POST',
            body: JSON.stringify(newUserAdmin),
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${token}`
            }
        })
    
        const user=await response.json()
    
        return user
        
    } catch (error) {
        return error
    }
}

export async function deleteUser(id,token){
    try {
        const response=await fetch(`${baseUrl}/api/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${token}`
            }
        })
    
        const user=await response.json()
    
        return user
        
    } catch (error) {
        return error
    }
}

export function showErrors(error){
    const errors={}

    if(error.includes('Name is required') || error.includes('Name too short or too long')){
        errors.nameError='Nome muito grande/pequeno'
    }

    if(error.includes('E-mail is required') || error.includes('Invalid email')){
        errors.emailError='E-mail inválido'
    }

    if(error.includes('Password is required') || error.includes('Password must be at least 6 characters long')){
        errors.passwordError='Senha muito pequena'
    }

    if(error.includes('Passwords need to be the same')){
        errors.confirmPasswordError='As senhas precisam ser iguais'
    }

    return errors
}

