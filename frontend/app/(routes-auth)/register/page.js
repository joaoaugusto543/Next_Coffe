'use client'
import Link from 'next/link'
import styles from './page.module.css'
import { imgs } from '@/app/api/api'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { useState } from 'react'
import { AiFillHome } from 'react-icons/ai'
import { createUser, showErrors } from '@/services/userServices'
import {useRouter} from 'next/navigation'
import { signIn } from 'next-auth/react'

function Register() {

  const images=['anonimo.png','avatarOne.png','avatarTwo.png','avatarThree.png','avatarFour.png','avatarFive.png']

  const [count,setCount]=useState(0)
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [confirmPassword,setConfirmPassword]=useState('')
  const [errors,setErrors]=useState({})

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

    const newUser={
        name,
        email,
        image:images[count],
        password,
        confirmPassword
    }

    const resCreate=await createUser(newUser)

    if(resCreate.errors){
        setErrors(showErrors(resCreate.errors))
    }

    const res=await signIn('credentials',{
        email:newUser.email,
        password:newUser.password,
        redirect:false
    })
  
    if(res.error){
        return null
    }
  
    router.replace('/')
  }


  return (
    <section className={styles.register}>
        <div className={styles.boxRegister}>
            <div className={styles.divForm}>
                <h1>Cadastro</h1>
                <div className={styles.imgs}>
                    <img src={`${imgs}/${images[count]}`} alt={images[count]} />
                    {count !== 0 && <button className={styles.left} onClick={handleLeft}><IoIosArrowBack/></button>}
                    { count !== 5 && <button className={styles.right} onClick={handleRight}><IoIosArrowForward/></button>}
                </div>
                <form className={styles.formRegister} onSubmit={handleSubmit}>
                    <label>
                        <span>Nome:</span>
                        <input type='text' placeholder='Digite nome' onChange={(e)=>setName(e.target.value)}/>
                        {errors.nameError && <p className={styles.error}>{errors.nameError}</p>}
                    </label>
                    <label>
                        <span>E-mail:</span>
                        <input type='email' placeholder='Digite seu e-mail' onChange={(e)=>setEmail(e.target.value)}/>
                        {errors.emailError && <p className={styles.error}>{errors.emailError}</p>}
                    </label>
                    <label>
                        <span>Senha:</span>
                        <input type='password' placeholder='Digite sua senha' onChange={(e)=>setPassword(e.target.value)}/>
                        {errors.passwordError && <p className={styles.error}>{errors.passwordError}</p>}
                    </label>
                    <label>
                        <span>Confirme sua senha:</span>
                        <input type='password' placeholder='Digite sua senha' onChange={(e)=>setConfirmPassword(e.target.value)}/>
                        {errors.confirmPasswordError && <p className={styles.error}>{errors.confirmPasswordError}</p>}
                    </label>
                    <input type='submit' value='Cadastrar' />
                </form>
                <Link href='/login'>Já possui conta?</Link>
            </div>
        </div>
        <Link className={styles.linkHome} href='/'><AiFillHome/>Início</Link>
    </section>
  )
}

export default Register