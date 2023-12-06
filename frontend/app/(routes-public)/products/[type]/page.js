import {TbCoffee} from 'react-icons/tb'
import styles from './page.module.css'
import ProductsLoader from '@/components/Loaders/ProductsLoader/ProductsLoader'
import { Suspense } from 'react'
import Products from '@/components/Products/Products'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { profile } from '@/services/userServices'
import { nextAuthOptions } from '@/app/api/auth/[...nextauth]/route'

export default async function ProductsType({params}) {

    const type=params.type

    const session=await getServerSession(nextAuthOptions)

    const user=await profile(session?.token)
  
  return (
    <>
      <section className={styles.productsType}>
        <div className={styles.banner}>
          <img src='https://images.unsplash.com/photo-1625021659159-f63f546d74a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80' alt="" />
          <TbCoffee/>
        </div>
        <div className={styles.types}>
          <Link className={styles.type} href='/'>Todos</Link>
          <Link className={type !== 'bebida' ? styles.type : `${styles.type} ${styles.active}`} href='/products/bebida'>Bebidas</Link>
          <Link className={type !== 'salgado' ? styles.type : `${styles.type} ${styles.active}`} href='/products/salgado'>Salgados</Link>
          <Link className={type !== 'doce' ? styles.type : `${styles.type} ${styles.active}`} href='/products/doce'>Doces</Link>
        </div>
        <div className={styles.products}>
          <Suspense fallback={<ProductsLoader/>}>
            <Products type={type} session={session} user={user}/>
          </Suspense>
        </div>
      </section>
    
    </>
  )
}

export async function generateMetadata({params}){

    const type=`${params.type.substring(0,1).toUpperCase()}${params.type.substring(1,params.type.lenght)}`

    return {
      title:type,
      description:`${type} e-commerce`
    }
}