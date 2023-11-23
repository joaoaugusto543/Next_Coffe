import { removeProduct } from '@/services/historicServices'
import styles from './ProductsCart.module.css'
import { AiFillCloseCircle } from 'react-icons/ai'
import { gifs } from '@/app/api/api'

function ProductsCart({token,cart,setCart}) {

  async function handleRemoveProduct(id){

    const filteredCart=cart.products.filter((product)=>product.id !== id)

    setCart({...cart,products:filteredCart})
    
    await removeProduct(token,cart.id,id)

  }

  return (
    <>
        {cart.products && cart.products.length === 0 &&
          <div className={styles.divGif}>
            <img className={`${styles.gif}`} autoPlay loop src={`${gifs}/empty_cart.gif`}></img>
            <p>Carrinho vazio...</p>
          </div>
        }
        {!cart.products &&
          <div className={styles.divGif}>
            <img className={`${styles.gif}`} autoPlay loop src={`${gifs}/empty_cart.gif`}></img>
            <p>Carrinho vazio...</p>
          </div>
        }
        {cart.products && cart.products.map((item)=>(
            <div key={item.id} className={styles.product}>
                <button onClick={() => handleRemoveProduct(item.id)}><AiFillCloseCircle/></button>
                <img srcSet={item.image} alt={item.name} />
                <p>{item.name}</p>
                <span>{item.amount} x R${parseFloat(item.price - (item.price*(item.discount/100))).toFixed(2).replace('.',',')}</span>
            </div>
        ))}
    </>
  )
}

export default ProductsCart