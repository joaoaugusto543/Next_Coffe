import { BsFillTrashFill } from 'react-icons/bs'
import styles from './HistoricLoader.module.css'

function HistoricLoader() {
  return (
    <div className={styles.historicLoader}>
      <div className={styles.imgLoader}></div>
      <p className={styles.nameLoader}></p>
      <div className={styles.buttonLoader}><BsFillTrashFill/></div>
    </div>
  )
}

export default HistoricLoader