import styles from './Warning.module.css'

function Warning({text,handleCloseWarning,action}) {
  return (
    <section className={styles.warning}>
        <div className={styles.boxWarning}>
            <p>{text}</p>
            <div className={styles.buttons}>
                <button onClick={action}>Sim</button>
                <button className={styles.buttons} onClick={handleCloseWarning}>Não</button>
            </div>
        </div>
    </section>
  )
}

export default Warning