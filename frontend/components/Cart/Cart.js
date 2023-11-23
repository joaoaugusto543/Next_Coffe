'use client'
import styles from './Cart.module.css'
import ProductsCart from '../ProductsCart/ProductsCart'
import { useEffect, useState } from 'react'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { BsFillCartXFill } from 'react-icons/bs'
import { closeHistoric, sumPrices } from '@/services/historicServices'
import PurchaseMade from '../PurchaseMade/PurchaseMade'

export default function Cart({session,onCart}) {

  const [open,setOpen]=useState(false)
  const [cart,setCart]=useState(onCart)
  const [showOk,setShowOk]=useState(false)

  useEffect(()=>{
    setCart(onCart)
  },[onCart])

  const total=sumPrices(cart.products)

  function closeCart(){
    setOpen(false)
  }

  function openCart(){
    setOpen(true)
  }

  async function handleCloseHistoric(){
    await closeHistoric(session.token,cart.id)

    setCart({})
    setOpen(false)
    setShowOk(true)
  }


  return (
    <>
      {showOk && <PurchaseMade setShowOk={setShowOk}/>}
      <div className={open ? styles.cart : `${styles.cart} ${styles.disappear}`}>
          <h1>Carrinho</h1>
          <ProductsCart setCart={setCart} token={session.token} cart={cart}/>
          {cart.products && cart.products.length !== 0 &&
            <>
              <p className={styles.total}>R$ {total}</p>
              <div className={styles.buy}>
                <button onClick={handleCloseHistoric}>Comprar</button>
              </div>
            </> 
          }
        
      </div>
      {!open &&     
        <button className={`${styles.iconCart} ${styles.close}`} onClick={openCart}>
          <div className={styles.divIcon}>
            <AiOutlineShoppingCart/>
            {cart.products ? <div className={styles.counter}>{cart.products.length}</div> : <div className={styles.counter}>0</div>}
          </div>
        </button>}
      {open && <button className={styles.iconCart} onClick={closeCart}><BsFillCartXFill/></button>}
    </>
  )
}
