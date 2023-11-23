import styles from './Products.module.css'
import { getServerSession } from 'next-auth'
import Product from '../Product/Product'
import { getProducts } from '@/services/productsServices'
import { nextAuthOptions } from '@/app/api/auth/[...nextauth]/route'
import { profile } from '@/services/userServices'
import { videos } from '@/app/api/api'

async function Products({type}) {

    const products=await getProducts(type)

    const session=await getServerSession(nextAuthOptions)

    const user=await profile(session?.token)

  return (
    <>
        {products.length === 0 &&
          <div className={styles.divVideo}>
            <video className={`${styles.video}`} autoPlay loop muted src={`${videos}/empty_products.mp4`}></video>
            <p>Estamos sem produtos no momento</p>
         </div>
        }
        {products && products.map((product)=>
            <Product key={product.id}  session={session} user={user} onProduct={product}/>
        )}
    </>
  )
}

export default Products