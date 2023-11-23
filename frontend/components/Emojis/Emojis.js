'use client'
import styles from './Emojis.module.css'
import {GrEmoji} from 'react-icons/gr'
import {BiLeaf} from 'react-icons/bi'
import {IoFastFoodOutline} from 'react-icons/io5'
import { emojis } from '@/data/emojis'
import { useState } from 'react'

function Emojis({setComment,comment}) {

  const boxsEmojis=emojis

  const [type,setType]=useState('reactions')

  return (
    <div className={styles.emojis}>
        <div className={styles.types}>
            <button className={type=='reactions' ? `${styles.type} ${styles.active}` : styles.type} onClick={() => setType('reactions')}><GrEmoji/></button>
            <button className={type=='nature' ? `${styles.type} ${styles.active}` : styles.type} onClick={() => setType('nature')}><BiLeaf/></button>
            <button className={type=='food' ? `${styles.type} ${styles.active}` : styles.type} onClick={() => setType('food')}><IoFastFoodOutline/></button>
        </div>
        <div className={styles.boxEmojis}>
            {boxsEmojis && boxsEmojis.map(boxEmoji => {
                if(boxEmoji.name === type){
                    return boxEmoji.emojis.map(emoji =>(
                      <button onClick={()=>setComment(comment + emoji)}>{emoji}</button>
                    ))
                }
            })}
        </div>
    </div>
  )
}

export default Emojis