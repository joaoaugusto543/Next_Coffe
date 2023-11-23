import { nextAuthOptions } from '@/app/api/auth/[...nextauth]/route'
import { getHistorics } from '@/services/historicServices'
import { getServerSession } from 'next-auth'
import styles from './Historics.module.css'
import Historic from '../Historic/Historic'
import { videos } from '@/app/api/api'

async function Historics() {

  const session=await getServerSession(nextAuthOptions)
  
  const historics=await getHistorics(session?.token)

  return (
    <>
        {historics && historics.length === 0 && 
          <div className={styles.divVideo}>
            <video className={`${styles.video}`} autoPlay loop muted src={`${videos}/empty_historics.mp4`}></video>
            <p>No momento você não possui compras, compre as comidas mais gostosas!!!</p>
          </div>
        }
        {historics && historics.map(historic => <Historic key={historic.id} token={session?.token} historic={historic}/>)}
    </>
  )
}

export default Historics