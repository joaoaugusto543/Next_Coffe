import styles from './page.module.css'
import Favorites from '@/components/Favorites/Favorites'
import { Suspense } from 'react'
import ProductsLoader from '@/components/Loaders/ProductsLoader/ProductsLoader'

export default async function FavoritesPage() {

  return (
    <section className={styles.favoritesPage}>
        <h1>Favoritos</h1>
        <div className={styles.favorites}>
          <Suspense fallback={<ProductsLoader/>}>
            <Favorites/>
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
