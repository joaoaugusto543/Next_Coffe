'use client'
import { useState } from 'react'
import styles from './Product.module.css'
import {IoMdArrowDropup,IoMdArrowDropdown} from 'react-icons/io'
import Link from 'next/link'
import { imgs } from '@/app/api/api'

function Product({product}) {

    const [amount,setAmount]=useState(1)

    function increaseAmount(e){
        e.preventDefault()

        if(amount + 1 <= 99){
            setAmount(amount + 1)
        }

        return
    }

    function decreaseAmount(e){
        e.preventDefault()

        if(amount - 1 > 0){
            setAmount(amount - 1)
        }

        return
    }

  return (
    <Link className={styles.linkProduct} href={`product/${product.id}`}>
        <div className={styles.product}>
            <img src={`${imgs}/InvalidImage.png`} srcSet={product.image} alt={product.name} />
            <h2>{product.name}</h2>
            {product.discount && <p className={styles.discount}>R$ {parseFloat(product.price - (product.price*(product.discount/100))).toFixed(2).replace('.',',')} <span className={styles.percentage}>{product.discount}%</span></p>}
            <p className={!product.discount ? styles.price : `${styles.price} ${styles.priceDiscount}`}>R$ {product.price.replace('.',',')}</p>
            <form className={styles.buy}>
                <input type='submit' value='Comprar' />
                <input type='number' disabled min={1} value={amount} />
                <div className={styles.buttons}>
                    <button onClick={increaseAmount}><IoMdArrowDropup/></button>
                    <button onClick={decreaseAmount}><IoMdArrowDropdown/></button>
                </div>
            </form>
        </div>
    </Link>
  )
}

export default Product