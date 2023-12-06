import {imgs } from '@/app/api/api'
import styles from './page.module.css'
import {BsArrowLeft} from 'react-icons/bs'
import Link from 'next/link'
import Assessment from '@/components/Assessment/Assessment'
import { Suspense } from 'react'
import ProductPageLoader from '@/components/Loaders/ProductPageLoader/ProductPageLoader'
import { getProduct } from '@/services/productsServices'
import { getComments } from '@/services/commentsServices'
import Comments from '@/components/Comments/Comments'
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { profile } from '@/services/userServices'

export default async function product({params}) {

  
  const product=await getProduct(params.product_id)
  const comments=await getComments(params.product_id)
  const session=await getServerSession(nextAuthOptions)
  const user=await profile(session.token)

  if(product.error){
    redirect('/')
  }

  return (
    <section className={styles.productPage}>
      {!product.error && <Suspense fallback={<ProductPageLoader/>}>
        <div className={styles.product}>
          <h1>{product.name}</h1>
          <img src={`${imgs}/InvalidImage.png`} srcSet={product.image} alt={product.name} />
          {product.discount && <h2 className={styles.discount}>R$ {parseFloat(product.price - (product.price*(product.discount/100))).toFixed(2).replace('.',',')} <span className={styles.percentage}>{product.discount}%</span></h2>}
          <h2 className={!product.discount ? styles.price : `${styles.price} ${styles.priceDiscount}`}>R$ {parseFloat(product.price).toFixed(2).replace('.',',')}</h2>
          <p>{product.description}</p>
        </div>
        <Assessment comments={comments}/>
        <div className={styles.comments}>
          <Comments session={session} onComments={comments} idProduct={product.id} user={user}/>
        </div>
        <Link className={styles.back} href='/'><BsArrowLeft/> Voltar</Link>
      </Suspense>}
    </section>
  )
}

export async function generateStaticParams(){
    const request=await fetch('http://localhost:5000/api/products/')
    const products=await request.json()
    return products.map((product)=>{
        product_id:String(product.id)
    })
}

export async function generateMetadata({params}){
  const requeste=await fetch(`http://localhost:5000/api/products/${params.product_id}`)

  const product=await requeste.json()

  return {
    title:product.name,
    description:product.description
  }
}

