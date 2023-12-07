'use client'
import { useState } from 'react'
import Comment from '../Comment/Comment'
import styles from './Comments.module.css'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import { imgs } from '@/app/api/api'
import { useRouter } from 'next/navigation'
import { createComment } from '@/services/commentsServices'
import Emojis from '../Emojis/Emojis'
import { BsEmojiSmile } from 'react-icons/bs'

function Comments({onComments,session,idProduct,user}) {

  const [comments,setComments]=useState(onComments)
  const [comment,setComment]=useState('')
  const [assessment,setAssessment]=useState(1)
  const {token}=session ? session : {}
  const router=useRouter()
  const [showEmojis,setShowEmojis]=useState(false)
  const [error,setError]=useState('')

  function createAssessment(amount){
    setAssessment(amount)
  }

  async function handleSubmit(e){

    e.preventDefault()

    const newComment={
        id_product:idProduct,
        id_user:user.id,
        image:user.image,
        name:user.name,
        comment,
        assessment,

    }

    const resComment=await createComment(idProduct,token,newComment)

    if(resComment.error){
      return
    }

    if(resComment.errors){
      setError('Comentário inválido')
      setTimeout(()=>setError(''),3000)
      return
    }

    setComments([resComment,...comments])

    setComment('')
    setAssessment(1)
    setShowEmojis(false)

    router.refresh()
  }

  function handleComment(e){

    if(e.target.value.length > 210){
        return
    }

    setComment(e.target.value)

    router.refresh()
  }

  function openEmojis(e){
    e.preventDefault()
    setShowEmojis(true)
  }

  function closeEmojis(e){
    e.preventDefault()
    setShowEmojis(false)
  }

  return (
    <>
        {session &&
            <div className={styles.comment}>
                <div className={styles.user}>
                    <img src={`${imgs}/anonimo.png`} srcSet={`${imgs}/${user.image}`} alt={user.name}/>
                    <p>{user.name}</p>
                </div>
                <div className={styles.stars}>
                    {assessment >= 1 ? <button className={styles.fullStar} onClick={()=>createAssessment(1)}><AiFillStar/></button> : <button onClick={()=>createAssessment(1)} className={styles.emptyStar}><AiOutlineStar/></button>}
                    {assessment >= 2 ? <button onClick={()=>createAssessment(2)} className={styles.fullStar}><AiFillStar/></button> : <button onClick={()=>createAssessment(2)} className={styles.emptyStar}><AiOutlineStar/></button>}
                    {assessment >= 3 ? <button onClick={()=>createAssessment(3)} className={styles.fullStar}><AiFillStar/></button> : <button onClick={()=>createAssessment(3)} className={styles.emptyStar}><AiOutlineStar/></button>}
                    {assessment >= 4 ? <button onClick={()=>createAssessment(4)} className={styles.fullStar}><AiFillStar/></button> : <button onClick={()=>createAssessment(4)} className={styles.emptyStar}><AiOutlineStar/></button>}
                    {assessment === 5 ? <button onClick={()=>createAssessment(5)} className={styles.fullStar}><AiFillStar/></button> : <button onClick={()=>createAssessment(5)} className={styles.emptyStar}><AiOutlineStar/></button>}
                </div>
                <div className={styles.commentForm}>
                  <form>
                      <label>
                          <textarea placeholder='Digite seu comentário' className={!showEmojis ? styles.textComment : `${styles.textComment} ${styles.commentActive}`} value={comment} onChange={handleComment}/>
                          {!showEmojis ? <button link='emoji' className={styles.buttonEmoji} onClick={openEmojis}><BsEmojiSmile/></button> : <button className={styles.buttonEmoji} onClick={closeEmojis}><BsEmojiSmile/></button>}
                      </label>
                  </form>
                  {showEmojis && <Emojis setComment={setComment} comment={comment}/>}
                  <div className={styles.submit}>
                    <button onClick={handleSubmit}>Comentar</button>
                  </div>
                  {error && <p className={styles.error}>{error}</p>}
                </div>
            </div> 
        }
        {comments && comments.map((comment)=><Comment user={user} comments={comments} setComments={setComments} key={comment.id} session={session} comment={comment}/>)}
    </>
  )
}

export default Comments