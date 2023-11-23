import { imgs } from '@/app/api/api'
import { getHistoric, getHistoricName, sumPrices } from '@/services/historicServices'
import { redirect } from 'next/navigation'
import styles from './HistoricProduct.module.css'
import Link from 'next/link'
import { BsArrowLeft } from 'react-icons/bs'

async function HistoricProduct({session,historic_id}) {

  const historic=await getHistoric(session.token,historic_id)
  
  if(historic.error){
      redirect('/historics')
  }

  const nameHistoric=getHistoricName(historic)

  const total=sumPrices(historic.products)

  return (
    <>
        {historic.products &&
            <section className={styles.historicProductsPage}>
                <h1>{nameHistoric}</h1>
                {historic.products && historic.products.map(product => (
                    <div key={product.id} className={styles.productHistoric}>
                        <img src={`${imgs}/InvalidImage.png`} srcSet={product.image} alt={product.name} />
                        <p>{product.name}</p>
                        <span>{product.amount} x R${parseFloat(product.price - (product.price*(product.discount/100))).toFixed(2).replace('.',',')}</span>
                    </div>
                ))}
                <p className={styles.total}>R$ {total}</p>
                <Link href={'/historics'}><BsArrowLeft/>Voltar</Link>
            </section>

        }
    </>
  )
}

export default HistoricProduct