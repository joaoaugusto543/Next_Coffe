import Historics from '@/components/Historics/Historics'
import styles from './page.module.css'
import { Suspense } from 'react'
import HistoricLoader from '@/components/Loaders/HistoricLoader/HistoricLoader'

export default async function HistoricsPage() {

  return (
    <section className={styles.historics}>
        <h1>Histórico</h1>
        <Suspense fallback={<HistoricLoader/>}>
          <Historics/>
        </Suspense>
    </section>
  )
}

export async function generateMetadata(){

  return {
    title:'Histórico',
    description:`Histórico e-commerce`
  }
}
