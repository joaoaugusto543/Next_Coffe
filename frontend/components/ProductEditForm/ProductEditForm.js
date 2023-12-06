'use client'
import { useState } from 'react'
import styles from './ProductEditForm.module.css'
import { removeDiscount, showErrors, updateProduct } from '@/services/productsServices'
import { useRouter } from 'next/navigation'

function ProductEditForm({product,session}) {

    const [name,setName]=useState(product.name)
    const [image,setImage]=useState(product.image)
    const [price,setPrice]=useState(parseFloat(product.price) > 10 ? `R$ ${parseFloat(product.price).toFixed(2).replace('.',',')}` : `R$ 0${parseFloat(product.price).toFixed(2).replace('.',',')}`)
    const [type,setType]=useState(product.type)
    const [description,setDescription]=useState(product.description)
    const [discount,setDiscount]=useState(product.discount)
    const [loader,setLoader]=useState(false)
    const [errors,setErrors]=useState({})
    const [success,setSuccess]=useState('')
    const router=useRouter()

    function handlePrice(e){
        const moneyValue=e.target.value
    
        const regexNumber=/^[0-9]+$/
    
        if(moneyValue==='R$ 00,000'){
          return
        }
    
        if(!regexNumber.test(moneyValue.replace('R$ ','').replace(',',''))){
          return
        }
    
        const valueArray=moneyValue.split('')
    
        const oldValueArray=moneyValue.split('')
    
        if(moneyValue.indexOf('0')===3 && moneyValue.length>price.length){
    
          valueArray[3]=''
      
          valueArray[5]=valueArray[6]
      
          valueArray[6]=oldValueArray[5]
    
          const finalValue=valueArray.join('')
    
          const moneyValueFloat=parseFloat(finalValue.replace('R$ ','').replace(',','.'))
    
          if(moneyValueFloat > 10000){
            return
          }
      
          setPrice(finalValue)
    
          return
    
        }
    
        if(moneyValue.indexOf('0')!==3 && moneyValue.length>price.length){
    
          const commaPosition=valueArray.indexOf(',')
    
          valueArray[commaPosition]=valueArray[commaPosition+1]
    
          valueArray[commaPosition+1]=oldValueArray[commaPosition]
    
          const finalValue=valueArray.join('')
    
          const moneyValueFloat=parseFloat(finalValue.replace('R$ ','').replace(',','.'))
    
          if(moneyValueFloat > 10000){
            return
          }
      
          setPrice(finalValue)
    
          return
    
        }
    
        if(moneyValue.length >= 8 && moneyValue.length < price.length){
    
          const commaPosition=valueArray.indexOf(',')
    
          valueArray[commaPosition]=valueArray[commaPosition-1]
    
          valueArray[commaPosition-1]=oldValueArray[commaPosition]
    
          setPrice(valueArray.join(''))
    
          return
    
        }
    
        if(moneyValue.length < 8 && moneyValue.length < price.length && price !== 'R$ 00,00'){
    
          const commaPosition=valueArray.indexOf(',')
    
          valueArray[commaPosition]=valueArray[commaPosition-1]
    
          valueArray[commaPosition-1]=oldValueArray[commaPosition]
    
          valueArray[3]=`0${price[3]}`
        
          setPrice(valueArray.join(''))
    
          return
        }
    }

    function handleDiscount(e){
        const value=e.target.value


        if(value > 99){
            return
        }

        if(value.indexOf('.') !== -1){
            return
        }
        

        setDiscount(parseInt(value))

    }

    async function editProduct(e){
        e.preventDefault()

        setLoader(true)

        const modifiedPrice=price.replace('R$ ','').replace(',','.')

        const editedProduct={
            name,
            image,
            price:modifiedPrice,
            type,
            description
        }

        if(discount){
          editedProduct.discount=discount
        }

        if(!discount && product.discount){
          setErrors({...errors,discountError:'Desconto inválido'})
        }

        const res=await updateProduct(product.id,editedProduct,session.token)

        if(res.error){
          setLoader(false)
          return
        }

        if(res.errors){
          setErrors(showErrors(res.errors))
          setLoader(false)
          return
        }

        setLoader(false)
        setErrors({})

        setSuccess('Produto editado')

        setTimeout(()=>{
          setSuccess('')
        },3000)

        router.refresh()
        
        return
    }

    async function handleRemoveDiscount(e){
        e.preventDefault()

        setLoader(true)

        await removeDiscount(product.id, session.token)

        setDiscount(null)
        setLoader(false)
        setErrors({...errors,discountError:''})

        setSuccess('Disconto removido')

        setTimeout(()=>{
          setSuccess('')
        },3000)

        router.refresh()

        return
    }


  return (
    <>
        {success && <p className={styles.success} >{success}</p>}
        {image && <img className={styles.imageProduct} src={image} alt={name} />}
        <form className={styles.formProduct}>
            <label>
                <span>Nome:</span>
                <input type='text' placeholder='Digite o nome do produto' value={name} onChange={(e)=>setName(e.target.value)}/>
                {errors.nameError && <p className={styles.error}>{errors.nameError}</p>}
            </label>
            <label>
                <span>Imagem:</span>
                <input type='text' placeholder='Digite a url da imagem do produto' value={image} onChange={(e)=>setImage(e.target.value)}/>
                {errors.imageError && <p className={styles.error}>{errors.imageError}</p>}
            </label>
            <label>
                <span>Preço:</span>
                <input type='text' placeholder='Digite o preço do produto' value={price} onChange={handlePrice}/>
                {errors.priceError && <p className={styles.error}>{errors.priceError}</p>}
            </label>
            <label>
                <span>Desconto:</span>
                <input type='number' placeholder='Digite o disconto do seu produto' value={discount ? discount : ''} onChange={handleDiscount}/>
                {product.discount && <button className={styles.removeDiscount} onClick={handleRemoveDiscount}>Remover disconto</button>}
                {errors.discountError && <p className={styles.error}>{errors.discountError}</p>}
            </label>
            <label>
                <span>Tipo:</span>
                <select name='types' id='types' value={type} onChange={(e)=>setType(e.target.value)}>
                    <option name='types' value=''>Selecione um tipo</option>
                    <option name='types' value='bebida'>Bebida</option>
                    <option name='types' value='salgado'>Salgado</option>
                    <option name='types' value='doce'>Doce</option>
                </select>
                {errors.typeError && <p className={styles.error}>{errors.typeError}</p>}
            </label>
            <label>
                <span>Descrição:</span>
                <textarea value={description} placeholder='Digite a descrição do produto' onChange={(e)=>setDescription(e.target.value)}/>
                {errors.descriptionError && <p className={styles.error}>{errors.descriptionError}</p>}
            </label>
            {!loader ? <input type='submit' value='Editar' onClick={editProduct} /> : <input type='submit' disabled value='Aguarde...' />}
        </form>
    </>
  )
}

export default ProductEditForm