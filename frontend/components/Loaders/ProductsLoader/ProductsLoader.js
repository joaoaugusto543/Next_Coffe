import styles from './ProductsLoader.module.css'
function ProductsLoader() {
  return (
    <div className={styles.productLoader}>
        <div className={styles.image}></div>
        <p className={styles.lineOne}></p>
        <p className={styles.lineTwo}></p>
        <div className={styles.divButton}>
            <div className={styles.button}></div>
        </div>
    </div>
  )
}

export default ProductsLoader