'use client'
import { imgs } from '@/app/api/api'
import {AiFillStar,AiOutlineStar} from 'react-icons/ai'
import {BsThreeDotsVertical} from 'react-icons/bs'
import styles from './Comment.module.css'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteComment } from '@/services/commentsServices'
import { deleteUser } from '@/services/userServices'
import Warning from '../Warning/Warning'

function Comment({comment,session,setComments,comments,user}) {

  const [showConfigComment,setShowConfigComment]=useState(false)
  const [showWarning,setShowWarning]=useState(false)
  const [loader,setLoader]=useState(false)

  const router=useRouter()

  function closeDeleteComment(){
    setShowConfigComment(false)
  }

  function openDeleteComment(){
    setShowConfigComment(true)
  }

  async function handleDeleteComment(){
    setLoader(true)
    await deleteComment(session?.token,comment.id)
    setComments(comments.filter(item => item.id !== comment.id))
    router.refresh()
    setLoader(false)
  }

  async function handleDeleteUser(){

    setLoader(true)

    const res=await deleteUser(comment.id_user,session.token)

    if(res.error){
      return
    }

    setComments(comments.filter(item => item.id !== comment.id))
    setLoader(false)
    setShowConfigComment(false)
    setShowWarning(false)
  }

  function handleShowWarning(){
    setShowWarning(true)
  }

  function handleCloseWarning(){
    setShowWarning(false)
  }

  return (
    <>
      {showWarning && <Warning text='Tem certeza que deseja excluir esse usuário?' handleCloseWarning={handleCloseWarning} action={handleDeleteUser}/>}
      <div className={styles.comment}>
          <div className={styles.user}>
              <img src={`${imgs}/anonimo.png`} srcSet={`${imgs}/${comment.image}`} alt={comment.name} />
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
          {user && !showConfigComment && user.id === comment.id_user && <button className={styles.threePoints} onClick={openDeleteComment}><BsThreeDotsVertical/></button>}
          {user && showConfigComment && user.id === comment.id_user && <button className={styles.threePoints} onClick={closeDeleteComment}><BsThreeDotsVertical/></button>}
          {user && !showConfigComment && user.id !== comment.id_user && session.user.admin && <button className={styles.threePoints} onClick={openDeleteComment}><BsThreeDotsVertical/></button>}
          {user && showConfigComment && user.id !== comment.id_user && session.user.admin && <button className={styles.threePoints} onClick={closeDeleteComment}><BsThreeDotsVertical/></button>}
          {user && showConfigComment &&
            <div className={styles.configComment}>
              <button className={styles.delete} onClick={handleDeleteComment} >{!loader ? 'Deletar Comentário' : 'Aguarde'}</button>
              {session.user.admin && session.user.id !== comment.id_user && <button onClick={handleShowWarning}>{!loader ? 'Deletar Usuário' : 'Aguarde'}</button>}
            </div> 
          }
      </div>
    </>
  )
}

export default Comment