import styles from './page.module.css'
import Favorites from '@/components/Favorites/Favorites'
import { Suspense } from 'react'
import ProductsLoader from '@/components/Loaders/ProductsLoader/ProductsLoader'
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from '@/app/api/auth/[...nextauth]/route'
import { profile } from '@/services/userServices'

export default async function FavoritesPage() {

  const session=await getServerSession(nextAuthOptions)

  const user=await profile(session.token)

  return (
    <section className={styles.favoritesPage}>
        <h1>Favoritos</h1>
        <div className={styles.favorites}>
          <Suspense fallback={<ProductsLoader/>}>
            <Favorites session={session} user={user}/>
          </Suspense>
        </div>
    </section>
  )
}

export function generateMetadata(){
    return {
      title:'Favoritos',
      description:'Favoritos e-commerce'
    }
}
