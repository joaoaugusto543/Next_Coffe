import { imgs } from '@/app/api/api'
import {AiFillStar,AiOutlineStar} from 'react-icons/ai'
import styles from './Comment.module.css'

function Comment({comment}) {
  return (
    <div className={styles.comment}>
        <div className={styles.user}>
            <img src={`${imgs}/${comment.image}`} alt={comment.name} />
            <p>{comment.name}</p>
        </div>
        <div className={styles.stars}>
            {comment.assessment >= 1 ? <span className={styles.fullStar}><AiFillStar/></span> : <span className={styles.emptyStar}><AiOutlineStar/></span>}
            {comment.assessment >= 2 ? <span className={styles.fullStar}><AiFillStar/></span> : <span className={styles.emptyStar}><AiOutlineStar/></span>}
            {comment.assessment >= 3 ? <span className={styles.fullStar}><AiFillStar/></span> : <span className={styles.emptyStar}><AiOutlineStar/></span>}
            {comment.assessment >= 4 ? <span className={styles.fullStar}><AiFillStar/></span> : <span className={styles.emptyStar}><AiOutlineStar/></span>}
            {comment.assessment === 5 ? <span className={styles.fullStar}><AiFillStar/></span> : <span className={styles.emptyStar}><AiOutlineStar/></span>}
        </div>
        <p className={styles.textComment}>{comment.comment}</p>
    </div>
  )
}

export default Comment