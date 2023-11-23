import { nextAuthOptions } from '@/app/api/auth/[...nextauth]/route'
import { getFavorites, profile } from '@/services/userServices'
import { getServerSession } from 'next-auth'
import styles from './Favorites.module.css'
import Product from '../Product/Product'
import { videos } from '@/app/api/api'

async function Favorites() {

    const session=await getServerSession(nextAuthOptions)

    const user=await profile(session.token)

    const favorites=await getFavorites(user)

  return (
    <>
        {favorites && favorites.length === 0 && 
          <div className={styles.divVideo}>
            <video className={`${styles.video}`} autoPlay loop muted src={`${videos}/empty_favorites.mp4`}></video>
            <p>No momento você não possui favoritos, favorite as comidas que você mais ama!!!</p>
          </div>
        }
        {favorites && favorites.map(favorite => <Product key={favorite.id} onProduct={favorite} session={session} user={user}/>)}
    </>
  )
}

export default Favorites