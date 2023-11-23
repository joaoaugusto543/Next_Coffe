import ProductForm from '@/components/ProductForm/ProductForm'
import styles from './page.module.css'
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from '@/app/api/auth/[...nextauth]/route'
import { BsArrowLeft } from 'react-icons/bs'
import Link from 'next/link'

export default async function createProduct() {

  const session=await getServerSession(nextAuthOptions)

  return (
    <section className={styles.createProduct}>
      <h1>Criar Produto</h1>
      <ProductForm session={session}/>
      <Link className={styles.back} href='/'><BsArrowLeft/> Voltar</Link>
    </section>
  )
}

export async function generateMetadata(){

  return {
    title:'Criar produto',
    description:`Criação de produto e-commerce`
  }
}