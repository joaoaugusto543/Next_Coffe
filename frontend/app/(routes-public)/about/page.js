import { imgs } from '@/app/api/api'
import styles from './page.module.css'

export default function about() {
  return (
    <section className={styles.about}>
      <div className={styles.content}>
        <img src={`${imgs}/logo.png`} className={styles.image} alt='logo' />
        <p>O e-commerce NextCoffee é uma plataforma online especializada em trazer a experiência premium da cafeteria diretamente para a sua casa. Com uma ampla gama de produtos relacionados ao café e acessórios, o NextCoffee oferece uma maneira conveniente e acessível para os amantes de café desfrutarem de qualidade excepcional onde quer que estejam.</p>
      </div>
    </section>
  )
}

export function generateMetadata(){
    return {
      title:'Sobre',
      description:'About e-commerce'
    }
}
  