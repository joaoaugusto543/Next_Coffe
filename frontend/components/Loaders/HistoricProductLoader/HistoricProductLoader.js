import { BsFillTrashFill } from 'react-icons/bs'
import styles from './HistoricProductLoader.module.css'

function HistoricProductLoader() {
  return (
    <>
        <div className={styles.title}></div>
        <div className={styles.historicProductLoader}>
          <div className={styles.imgLoader}></div>
          <p className={styles.nameLoader}></p>
          <p className={styles.nameLoader}></p>
        </div>
    </>
  )
}

export default HistoricProductLoader