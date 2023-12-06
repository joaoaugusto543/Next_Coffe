import { getServerSession } from 'next-auth'
import styles from './page.module.css'
import { nextAuthOptions } from '@/app/api/auth/[...nextauth]/route'
import { Suspense } from 'react'
import HistoricProduct from '@/components/HistoricProduct/HistoricProduct'
import { getHistoric, getHistoricName } from '@/services/historicServices'
import HistoricProductLoader from '@/components/Loaders/HistoricProductLoader/HistoricProductLoader'

export default async function page({params}) {

    const {historic_id}=params
    const session=await getServerSession(nextAuthOptions)
  
  return (
    <section className={styles.historicPage}>
      <Suspense fallback={<HistoricProductLoader/>}>
        <HistoricProduct session={session} historic_id={historic_id}/>
      </Suspense>
    </section>
  )
}

export async function generateMetadata({params}){

  const session=await getServerSession(nextAuthOptions)

  const historic=await getHistoric(session.token,params.historic_id)

  const nameHistoric=getHistoricName(historic)

  return {
    title:nameHistoric,
    description:`${nameHistoric} e-commerce`
  }
}
