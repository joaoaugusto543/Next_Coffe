'use client'
import { useState } from 'react'
import styles from './ProductForm.module.css'
import { createProduct, showErrors } from '@/services/productsServices'


function ProductForm({session}) {

    const [name,setName]=useState('')
    const [image,setImage]=useState('')
    const [price,setPrice]=useState('R$ 00,00')
    const [type,setType]=useState('')
    const [description,setDescription]=useState('')
    const [loader,setLoader]=useState(false)
    const [errors,setErrors]=useState({})

    async function handleSubmit(e){
        e.preventDefault()

        setLoader(true)

        const modifiedPrice=price.replace('R$ ','').replace(',','.')

        const newProduct={
            name,
            image,
            price:modifiedPrice,
            type,
            description
        }

        const res=await createProduct(newProduct,session.token)

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
        setName('')
        setPrice('R$ 00,00')
        setImage('')
        setDescription('')
        setType('')
    }

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

  return (
    <>
        {image && <img className={styles.imageProduct} src={image} alt={name} />}
        <form className={styles.formProduct} onSubmit={handleSubmit}>
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
                <span>Tipo:</span>
                <select name='types' id='types' onChange={(e)=>setType(e.target.value)}>
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
            {!loader ? <input type='submit' value='Criar' /> : <input type='submit' disabled value='Aguarde...' />}
        </form>
    </>
  )
}

export default ProductForm