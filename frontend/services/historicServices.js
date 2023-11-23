import { baseUrl } from '@/app/api/api'

export async function addProduct(token,idProduct,amount){

    try {
        const response=await fetch(`${baseUrl}/api/historic/${idProduct}`, {
            method: 'PUT',
            body:JSON.stringify({
                amount
            }),
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

export async function getHistoricOpen(token){
    try {

        if(!token){
            return
        }

        const response=await fetch(`${baseUrl}/api/historic/`, {
            cache:'no-store',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${token}`
            }
        })
        
        const historics=await response.json()

        const historicOpen=historics.find(historic => historic.open)

        if(!historicOpen){
            return {}
        }

        historicOpen.products=historicOpen.products.map((product)=>JSON.parse(product))

        return historicOpen
        
    } catch (error) {
        console.log(error)
        return error
        
    }

}

export async function getHistorics(token){
    try {

        const response=await fetch(`${baseUrl}/api/historic/`, {
            cache:'no-store',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${token}`
            }
        })
        
        const historics=await response.json()

        const historicsClose=historics.filter(historic => !historic.open)

        historicsClose.map((historic)=>{
            historic.products=historic.products.map((product)=>JSON.parse(product))

            return historic
        })

        return historicsClose.reverse()
        
    } catch (error) {
        console.log(error)
        return error
        
    }

}

export function sumPrices(products){

    let total=0

    if(!products){
        return
    }

    products.map((item) => {

        if(item.discount){
            const newPrice=parseFloat(item.price - (item.price * (item.discount/100)))

            total += parseFloat(item.amount * newPrice)

            return 
        }else{

            total += parseFloat(item.amount * item.price)

            return 
        }
    })

    return total.toFixed(2)

}

export async function removeProduct(token,idCart,idProduct){
    try {
        await fetch(`${baseUrl}/api/historic/${idCart}/${idProduct}`, {
            cache:'no-store',
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${token}`
            }
        })
    
        return 
        
    } catch (error) {
        console.log(error)
        return error
        
    }

}

export async function closeHistoric(token,idCart){
    try {
        await fetch(`${baseUrl}/api/historic/open/close/${idCart}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${token}`
            }
        })
    
        return 
        
    } catch (error) {
        console.log(error)
        return error
        
    }

}

export function getHistoricName(historic){

    let historicName=''

    historic.products.map((product,index) => {

        if(index !== historic.products.length-1){

            historicName+=product.name + ', '

        }else{

            historicName+=product.name

        }

    })

    if(historicName.length > 34){
        historicName=historicName.substring(0,28) + '...'
    }

    return historicName
}

export async function deleteHistoric(token,id){
    try {

        await fetch(`${baseUrl}/api/historic/${id}`, {
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

export async function getHistoric(token,id){
    try {
    
        const response=await fetch(`${baseUrl}/api/historic/${id}`, {
            cache:'no-store',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${token}`
            }
        })
        
        const historic=await response.json()

        if(historic.error){
            return historic
        }

        historic.products=historic.products.map(product => JSON.parse(product))

        return historic

    } catch (error) {
        return error
    }
}

