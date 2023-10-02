import { baseUrl } from '@/app/api/api'

export async function getProducts(type){

    if(type){
  
      const requeste=await fetch(`${baseUrl}/api/products/filter/${type}`,{cache:'no-cache'})
      const products=await requeste.json()
      return products
  
    }else{
      const requeste=await fetch(`${baseUrl}/api/products/`,{cache:'no-cache'})
      const products=await requeste.json()
      return products
  
    }
}

export async function getProduct(id){
    const requeste=await fetch(`${baseUrl}/api/products/${id}`,{cache:'no-cache'})
    const product=await requeste.json()
    return product
}