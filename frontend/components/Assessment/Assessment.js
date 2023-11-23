'use client'
import assessment from '@/services/assessment'
import styles from './Assessment.module.css'

function Assessment({comments}) {

    const {percentageFiveStars,percentageFourStars,percentageOneStar,percentageThreeStars,percentageTwoStars,total}=assessment(comments)

  return (
    <section className={styles.assessment}>        
        <div className={styles.total}>
            <h1>{total}</h1>
            <p>{comments.length} comentários</p>
        </div>
        <div className={styles.starsPercentage}>
            <div className={styles.starPercentagem}>
                <span>5</span>
                <div className={styles.bar}>
                    <div style={{width:`${percentageFiveStars}%`}}></div>
                </div>
            </div>
            <div className={styles.starPercentagem}>
                <span>4</span>
                <div className={styles.bar}>
                    <div style={{width:`${percentageFourStars}%`}}></div>
                </div>
            </div>
            <div className={styles.starPercentagem}>
                <span>3</span>
                <div className={styles.bar}>
                    <div style={{width:`${percentageThreeStars}%`}}></div>
                </div>
            </div>
            <div className={styles.starPercentagem}>
                <span>2</span>
                <div className={styles.bar}>
                    <div style={{width:`${percentageTwoStars}%`}}></div>
                </div>
            </div>
            <div className={styles.starPercentagem}>
                <span>1</span>
                <div className={styles.bar}>
                    <div style={{width:`${percentageOneStar}%`}}></div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Assessment