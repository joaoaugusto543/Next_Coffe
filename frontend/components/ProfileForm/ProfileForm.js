'use client'
import { imgs } from '@/app/api/api'
import styles from './ProfileForm.module.css'
import { useState } from 'react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { updateUser } from '@/services/userServices'
import { useRouter } from 'next/navigation'

function ProfileForm({user,token}) {

    const images=['anonimo.png','avatarOne.png','avatarTwo.png','avatarThree.png','avatarFour.png','avatarFive.png']

    const [count,setCount]=useState(images.indexOf(user.image))
    const [name,setName]=useState(user.name)
    const [loader,setLoader]=useState(false)
    const [error,setError]=useState('')
    const [success,setSuccess]=useState('')
    const router=useRouter()

    function handleLeft(){
        if(count <= 0){
            return
        }
    
        setCount(count-1)
      }
    
      function handleRight(){
        if(count >= 5){
            return
        }
    
        setCount(count+1)
      }

      async function handleSubmit(e){
        e.preventDefault()

        if(loader){
            return
        }

        setLoader(true)

        const userUpdated={
            name,
            image:images[count]
        }

        const res=await updateUser(token,userUpdated)

        if(res.errors){
            setError('Nome muito grande/pequeno')
            setLoader(false)
            return
        }

        router.refresh()

        setSuccess('Conta atualizada')
        setTimeout(()=>setSuccess(''),3000)
        setError('')
        setLoader(false)
      }

  return (
    <>
        {success && <p className={styles.success}>{success}</p>}
        <div className={styles.imgs}>
            <img src={`${imgs}/${images[count]}`} alt={images[count]} />
            {count !== 0 && <button className={styles.left} onClick={handleLeft}><IoIosArrowBack/></button>}
            { count !== 5 && <button className={styles.right} onClick={handleRight}><IoIosArrowForward/></button>}
        </div>
        <form className={styles.formProfile} onSubmit={handleSubmit}>
            <label>
                <span>Nome:</span>
                <input type='text' placeholder='Digite nome' value={name} onChange={(e)=>setName(e.target.value)}/>
                {error && <p className={styles.error}>{error}</p>}
            </label>
            <label>
                <span>E-mail:</span>
                <input type='email' disabled value={user.email}/>
            </label>
            {!loader ? <input type='submit' value='Editar' /> : <input type='submit' disabled value='Aguarde...' />}
        </form>
    </>
  )
}

export default ProfileForm