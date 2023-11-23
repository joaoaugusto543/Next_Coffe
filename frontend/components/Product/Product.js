'use client'
import { useRef, useState } from 'react'
import styles from './Product.module.css'
import {IoMdArrowDropup,IoMdArrowDropdown} from 'react-icons/io'
import { imgs } from '@/app/api/api'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import { addFavorites, removeFavorites } from '@/services/userServices'
import { addProduct } from '@/services/historicServices'
import { useRouter } from 'next/navigation'
import { BsThreeDotsVertical } from 'react-icons/bs'
import Warning from '../Warning/Warning'
import { deleteProduct } from '@/services/productsServices'

function Product({onProduct,session,user}) {

    const [amount,setAmount]=useState(1)

    const [favorites,setFavorites]=useState(user?.favorites ? user.favorites : [])

    const [loader,setLoader]=useState(false)

    const [showCommands,setShowCommands]=useState(false)

    const [showWarning,setShowWarning]=useState(false)

    const [product]=useState({...onProduct,price: onProduct.price > 10 ? onProduct.price : onProduct.price.replace('0','')})

    const ref=useRef()

    const router=useRouter()

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

    async function handleAddFavorite(){
        setFavorites([...favorites,{id:product.id}])

        await addFavorites(session.token,product.id)

        router.refresh()
    }

    async  function handleRemoveFavorite(){

        setFavorites(favorites.filter(favorite => favorite.id !== product.id))

        await removeFavorites(session.token,product.id)

        router.refresh()

    }

    async function handleSubmit(e){
        e.preventDefault()

        if(!session){
            router.replace('/login')
            return
        }

        setLoader(true)

        await addProduct(session.token,product.id,amount)

        setAmount(1)

        router.refresh()

        setLoader(false)
    }

    function redirect(e){
        if(e.target.id===ref.current.id){
            router.replace(`/product/${product.id}`)
        }
    }

    function closeCommands(){
        setShowCommands(false)
    }

    function openCommands(){
        setShowCommands(true)
    }

    function redirectEditProduct(){
        router.replace(`/edit-product/${product.id}`)
    }

    function handleCloseWarning(){
        setShowWarning(false)
    }

    function handleShowWarning(){
        setShowCommands(false)
        setShowWarning(true)
    }

    async function handleDeleteProduct(){
        await deleteProduct(product.id,session.token)

        setShowWarning(false)

        router.refresh()
    }


  return (
    <div className={styles.divProduct} onClick={redirect}>
            {showWarning && <Warning handleCloseWarning={handleCloseWarning} action={handleDeleteProduct} text='Tem certeza que deseja excluir esse produto?'/>}
            <div id='link' className={styles.product} ref={ref}>
                <img id='link' src={`${imgs}/InvalidImage.png`} srcSet={product.image} alt={product.name} />
                <h2 id='link'>{product.name}</h2>
                {product.discount && <p id='link' className={styles.discount}>R$ {parseFloat(product.price - (product.price*(product.discount/100))).toFixed(2).replace('.',',')} <span className={styles.percentage}>{product.discount}%</span></p>}
                <p id='link' className={!product.discount ? styles.price : `${styles.price} ${styles.priceDiscount}`}>R$ {product.price.replace('.',',')}</p>
                <form className={styles.buy} onSubmit={handleSubmit}>
                    {!loader ? <input type='submit' value='Comprar' /> : <input type='submit' disabled value='Aguarde...' />}
                    <input type='number' disabled min={1} value={amount} />
                    <div className={styles.buttons}>
                        <button onClick={increaseAmount}><IoMdArrowDropup/></button>
                        <button onClick={decreaseAmount}><IoMdArrowDropdown/></button>
                    </div>
                </form>
            </div>
        {showCommands && 
            <div className={styles.commands}>
                <button onClick={redirectEditProduct}>Editar</button>
                <button onClick={handleShowWarning}>Deletar</button>
            </div>
        }
        { session?.user.admin && !showCommands && <button className={styles.threePoints} onClick={openCommands}><BsThreeDotsVertical/></button>}
        { session?.user.admin && showCommands && <button className={styles.threePoints} onClick={closeCommands}><BsThreeDotsVertical/></button>}
        { session && favorites.find(favorite => favorite.id === product.id) && <button onClick={handleRemoveFavorite} className={`${styles.favorite} ${styles.full}`}><AiFillStar/></button>}
        { session && !favorites.find(favorite => favorite.id === product.id) && <button onClick={handleAddFavorite} className={styles.favorite}><AiOutlineStar/></button>}
    </div>
  )
}

export default Product