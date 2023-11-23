import styles from './page.module.css'
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from '@/app/api/auth/[...nextauth]/route'
import ProductEditForm from '@/components/ProductEditForm/ProductEditForm'
import { getProduct } from '@/services/productsServices'
import Link from 'next/link'
import { BsArrowLeft } from 'react-icons/bs'

export default async function EditarProduto({params}) {

  const session=await getServerSession(nextAuthOptions)

  const product= await getProduct(params.id_product)

  return (
    <section className={styles.editProduct}>
      <h1>Editar Produto</h1>
      <ProductEditForm session={session} product={product}/>
      <Link className={styles.back} href='/'><BsArrowLeft/> Voltar</Link>
    </section>
  )
}

export async function generateMetadata(){

  return {
    title:'Editar produto',
    description:`Edição de produto e-commerce`
  }
}