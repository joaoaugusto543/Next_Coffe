'use client'
import { videos } from '@/app/api/api'
import styles from './PurchaseMade.module.css'
import { BsArrowLeft } from 'react-icons/bs'

function PurchaseMade({setShowOk}) {

    function handleClose(){
        setShowOk(false)
    }

  return (
    <section className={styles.purchaseMade}>
        <div className={styles.content}>
            <video className={`${styles.video}`} autoPlay muted src={`${videos}/ok.mp4`}></video>
            <h1>Compra concluída</h1>
        </div>
        <button onClick={handleClose}><BsArrowLeft/>Voltar</button>
    </section>
  )
}

export default PurchaseMade