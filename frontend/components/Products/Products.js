'use client'
import { useEffect, useState } from 'react'
import styles from './Products.module.css'
import Product from '../Product/Product'
import { getProducts } from '@/services/productsServices'
import { videos } from '@/app/api/api'
import ProductsLoader from '../Loaders/ProductsLoader/ProductsLoader'

function Products({type,session,user}) {

  const [products,setProducts]=useState([])
  const [loader,setLoader]=useState(true)
  const [wait,setWait]=useState(false)

  useEffect(()=>{
    handleGetProducts()
  },[type])

  
  async function handleGetProducts(){
      const products=await getProducts(type)
      setProducts(products)
      setLoader(false)
  }

  return (
    <>
        {products.length === 0 && loader && <ProductsLoader/>}
        {products.length === 0 && !loader &&
          <div className={styles.divVideo}>
            <video className={`${styles.video}`} autoPlay loop muted src={`${videos}/empty_products.mp4`}></video>
            <p>Estamos sem produtos no momento</p>
         </div>
        }
        {products && products.map((product)=>
            <Product key={product.id} wait={wait} setWait={setWait}  session={session} user={user} onProduct={product}/>
        )}
    </>
  )
}

export default Products