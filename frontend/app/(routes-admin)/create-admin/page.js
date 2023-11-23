import FormAdmin from '@/components/FormAdmin/FormAdmin'
import styles from './page.module.css'
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from '@/app/api/auth/[...nextauth]/route'
import Link from 'next/link'
import { BsArrowLeft } from 'react-icons/bs'

export default async function createAdmin() {

  const session=await getServerSession(nextAuthOptions)

  return (
    <section className={styles.createAdmin}>
        <h1>Criar Admin</h1>
        <FormAdmin session={session}/>
        <Link className={styles.back} href='/'><BsArrowLeft/> Voltar</Link>
    </section>
  )
}


export async function generateMetadata(){

  return {
    title:'Criar admin',
    description:`Criação de admin e-commerce`
  }
}