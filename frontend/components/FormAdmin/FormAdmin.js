'use client'
import styles from './FormAdmin.module.css'
import { imgs } from '@/app/api/api'
import { createUserAdmin, showErrors } from '@/services/userServices'
import { useState } from 'react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'


function FormAdmin({session}) {

    const images=['anonimo.png','avatarOne.png','avatarTwo.png','avatarThree.png','avatarFour.png','avatarFive.png']

    const [count,setCount]=useState(0)
    const [name,setName]=useState('')
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [confirmPassword,setConfirmPassword]=useState('')
    const [loader,setLoader]=useState(false)
    const [errors,setErrors]=useState({})
    const [success,setSuccess]=useState('')

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

          setLoader(true)

          const newUser={
              name,
              email,
              image:images[count],
              password,
              confirmPassword
          }

          const res=await createUserAdmin(newUser,session?.token)

          setLoader(false)

          if(res.error){
            return null
          }

          if(res.errors){
            setErrors(showErrors(res.errors))
            return
          }

          setSuccess('Admin criado')

          setTimeout(()=>{
            setSuccess('')
          },3000)

          setName('')
          setEmail('')
          setCount(0)
          setPassword('')
          setConfirmPassword('')

      }

  return (
    <>
        {success && <p className={styles.success}>{success}</p>}
        <div className={styles.imgs}>
            <img src={`${imgs}/${images[count]}`} alt={images[count]} />
            {count !== 0 && <button className={styles.left} onClick={handleLeft}><IoIosArrowBack/></button>}
            { count !== 5 && <button className={styles.right} onClick={handleRight}><IoIosArrowForward/></button>}
        </div>
        <form className={styles.formAdmin} onSubmit={handleSubmit}>
          <label>
            <span>Nome:</span>
            <input type='text' placeholder='Digite nome' value={name} onChange={(e)=>setName(e.target.value)}/>
            {errors.nameError && <p className={styles.error}>{errors.nameError}</p>}
          </label>
          <label>
            <span>E-mail:</span>
            <input type='email' placeholder='Digite seu e-mail' value={email} onChange={(e)=>setEmail(e.target.value)}/>
            {errors.emailError && <p className={styles.error}>{errors.emailError}</p>}
          </label>
          <label>
            <span>Senha:</span>
            <input type='password' placeholder='Digite sua senha' value={password} onChange={(e)=>setPassword(e.target.value)}/>
            {errors.passwordError && <p className={styles.error}>{errors.passwordError}</p>}
          </label>
          <label>
            <span>Confirme sua senha:</span>
            <input type='password' placeholder='Digite sua senha' value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
            {errors.confirmPasswordError && <p className={styles.error}>{errors.confirmPasswordError}</p>}
          </label>
          {!loader ? <input type='submit' value='Criar' /> : <input type='submit' disabled value='Aguarde...' />}
        </form>
    </>
  )
}

export default FormAdmin