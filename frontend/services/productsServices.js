import { baseUrl } from '@/app/api/api'

export async function getProducts(type){

  try {
    if(type){
  
      const requeste=await fetch(`${baseUrl}/api/products/filter/${type}`,{cache:'no-cache'})
      const products=await requeste.json()
      return products
  
    }else{
      const requeste=await fetch(`${baseUrl}/api/products/`,{cache:'no-cache'})
      const products=await requeste.json()
      return products
  
    }
    
  } catch (error) {
    return error
  }

}

export async function getProduct(id){
  try {

    const requeste=await fetch(`${baseUrl}/api/products/${id}`,{cache:'no-cache'})
  
    const products=await requeste.json()

    return products
    
  } catch (error) {
    
    return error

  }
}

export async function createProduct(newProduct,token){
  try {
      const response=await fetch(`${baseUrl}/api/products`, {
          method: 'POST',
          body: JSON.stringify(newProduct),
          headers: {
              'Content-Type': 'application/json',
              'Authorization' : `Bearer ${token}`
          }
      })
  
      const product=await response.json()
  
      return product
      
  } catch (error) {
      return error
  }
}


export async function deleteProduct(idProduct,token){

  try {
      const response=await fetch(`${baseUrl}/api/products/${idProduct}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
              'Authorization' : `Bearer ${token}`
          }
      })
  
      const product=await response.json()
  
      return product
      
  } catch (error) {
      return error
  }
}

export async function updateProduct(id,editedProduct,token){
  try {
      const response=await fetch(`${baseUrl}/api/products/${id}`, {
          method: 'PUT',
          body: JSON.stringify(editedProduct),
          headers: {
              'Content-Type': 'application/json',
              'Authorization' : `Bearer ${token}`
          }
      })
  
      const product=await response.json()
  
      return product
      
  } catch (error) {
      return error
  }
}

export async function removeDiscount(id,token){
  try {
      const response=await fetch(`${baseUrl}/api/products/discount/${id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'Authorization' : `Bearer ${token}`
          }
      })
  
      const product=await response.json()
  
      return product
      
  } catch (error) {
      return error
  }
}

export function showErrors(error){
  const errors={}

  if(error.includes('Name is required') || error.includes('Name too short or too long')){
      errors.nameError='Nome muito grande/pequeno'
  }

  if(error.includes('Price is required') || error.includes('Invalid price')){
    errors.priceError='preço inválida'
  }

  if(error.includes('Image is required') || error.includes('Invalid image')){
      errors.imageError='Imagem inválida'
  }

  if(error.includes('Type is required') || error.includes('Invalid type')){
      errors.typeError='Tipo inválido'
  }

  if(error.includes('Description is required') || error.includes('Short description')){
      errors.descriptionError='Descrição muito pequena'
  }

  if(error.includes('Discount is required') || error.includes('Invalid discount')){
    errors.discountError='Descrição muito pequena'
  }


  return errors
}


