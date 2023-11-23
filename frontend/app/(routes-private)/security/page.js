import styles from './page.module.css'
import SecurityForm from '@/components/SecurityForm/SecurityForm'
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from '@/app/api/auth/[...nextauth]/route'

export default async function Security() {

  const session=await getServerSession(nextAuthOptions)
  
  return (
    <section className={styles.security}>
        <h1>Segurança</h1>
        <SecurityForm token={session.token}/>
    </section>
  )
}

export async function generateMetadata(){

  return {
    title:'Segurança',
    description:`Segurança e-commerce`
  }
}