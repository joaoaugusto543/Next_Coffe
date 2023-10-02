import {TbCoffee} from 'react-icons/tb'
import styles from './page.module.css'
import ProductsLoader from '@/components/Loaders/ProductsLoader/ProductsLoader'
import { Suspense } from 'react'
import Products from '@/components/Products/Products'
import Link from 'next/link'

export default function Page() {
  
  return (
    <>
      <section className={styles.home}>
        <div className={styles.banner}>
          <img src='https://images.unsplash.com/photo-1625021659159-f63f546d74a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80' alt='banner' />
          <TbCoffee/>
        </div>
        <div className={styles.types}>
          <Link className={`${styles.active} ${styles.type}`} href='/'>Todos</Link>
          <Link className={styles.type} href='/products/bebida'>Bebidas</Link>
          <Link className={styles.type} href='/products/salgado'>Salgados</Link>
          <Link className={styles.type} href='/products/doce'>Doces</Link>
        </div>
        <div className={styles.products}>
          <Suspense fallback={<ProductsLoader/>}>
            <Products/>
          </Suspense>
        </div>
      </section>
    
    </>
  )
}