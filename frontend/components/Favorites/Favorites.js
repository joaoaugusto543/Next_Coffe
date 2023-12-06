'use client'
import { getFavorites } from '@/services/userServices'
import styles from './Favorites.module.css'
import Product from '../Product/Product'
import { videos } from '@/app/api/api'
import { useEffect, useState } from 'react'
import ProductsLoader from '../Loaders/ProductsLoader/ProductsLoader'

function Favorites({session,user}) {

  const [favorites,setFavorites]=useState([])
  const [loader,setLoader]=useState(true)
  const [wait,setWait]=useState(false)

  useEffect(()=>{
    handleGetFavorites()
  },[user])

  
  async function handleGetFavorites(){
      const favorites=await getFavorites(user)
      setFavorites(favorites.filter(favorite => favorite))
      setLoader(false)
  }

  return (
    <>
        {favorites.length ===0 && loader && <ProductsLoader/>}
        {favorites.length === 0 && !loader &&
          <div className={styles.divVideo}>
            <video className={`${styles.video}`} autoPlay loop muted src={`${videos}/empty_favorites.mp4`}></video>
            <p>No momento você não possui favoritos, favorite as comidas que você mais ama!!!</p>
          </div>
        }
        {favorites && favorites.map(favorite => <Product key={favorite.id} wait={wait} setWait={setWait} onProduct={favorite} session={session} user={user}/>)}
    </>
  )
}

export default Favorites