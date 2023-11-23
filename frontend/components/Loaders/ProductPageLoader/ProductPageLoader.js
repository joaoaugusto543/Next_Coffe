import styles from './ProductPageLoader.module.css'

function ProductPageLoader() {
  return (
    <div className={styles.productPageLoader}>
        <h1></h1>
        <div className={styles.loaderImg}></div>
        <p></p>
        <div className={styles.loaderAssessment}></div>
        <ul>
            <li><div className={styles.loaderProfile}></div><div></div></li>
            <li><div className={styles.loaderProfile}></div><div></div></li>
            <li><div className={styles.loaderProfile}></div><div></div></li>
        </ul>
    </div>
  )
}

export default ProductPageLoader