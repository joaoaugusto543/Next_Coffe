'use client'
import { imgs } from '@/app/api/api'
import styles from './Historic.module.css'
import { BsFillTrashFill } from 'react-icons/bs'
import { getHistoricName } from '@/services/historicServices'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import {deleteHistoric} from '@/services/historicServices'

function Historic({historic,token}) {

  const historicName=getHistoricName(historic)

  const [loader,setLoader]=useState(false)

  const router=useRouter()

  const ref=useRef()

  function redirect(e){

    if(e.target.id === ref.current.id){
      router.replace(`historics/${historic.id}`)
      return
    }

  }

  async function handleDeleteHistoric(){
    setLoader(true)
    await deleteHistoric(token,historic.id)
    router.refresh()
  }

  return (
    <div id='link' ref={ref} className={styles.historic} onClick={redirect}>
      {historic.products.length === 1 && <img className={styles.imageAlone} src={`${imgs}/InvalidImage.png`} srcSet={historic.products[0].image}/>}
      {historic.products.length > 1 && historic.products.length < 4 && 
        <div className={styles.twoImages}>
          <img src={`${imgs}/InvalidImage.png`} srcSet={historic.products[0].image}/>
          <img src={`${imgs}/InvalidImage.png`} srcSet={historic.products[1].image}/>
        </div>
      }
      {historic.products.length >=  4 &&
        <div className={styles.fourImages}>
          <img src={`${imgs}/InvalidImage.png`} srcSet={historic.products[0].image}/>
          <img src={`${imgs}/InvalidImage.png`} srcSet={historic.products[1].image}/>
          <img src={`${imgs}/InvalidImage.png`} srcSet={historic.products[2].image}/>
          <img src={`${imgs}/InvalidImage.png`} srcSet={historic.products[3].image}/>
        </div>
      }
      <p>{historicName}</p>
      {!loader && <button onClick={handleDeleteHistoric} ><BsFillTrashFill/></button>}
      {loader && <div className={styles.loader}></div>}
    </div>
  )
}

export default Historic