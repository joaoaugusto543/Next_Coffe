'use client'
import { useState } from 'react'
import styles from './page.module.css'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { AiFillHome } from 'react-icons/ai'

export default function Login() {

  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [error,setError]=useState('')

  const router=useRouter()

  async function handleSubmit(e){
    e.preventDefault()

    const res=await signIn('credentials',{
      email,
      password,
      redirect:false
    })

    if(res.error){
      setError('Falha no login')
      //setTimeout(()=>setError(''),3000)
      return null
    }

    router.replace('/')

  }

  return (
    <section className={styles.login}>
        <div className={styles.boxLogin}>
            <div className={styles.divForm}>
                <h1>Login</h1>
                {error && <p className={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit} className={styles.formLogin}>
                    <label>
                        <span>E-mail:</span>
                        <input type='email' placeholder='Digite seu e-mail' onChange={(e)=>setEmail(e.target.value)}/>
                    </label>
                    <label>
                        <span>Senha:</span>
                        <input type='password' placeholder='Digite sua senha' onChange={(e)=>setPassword(e.target.value)}/>
                    </label>
                    <input type='submit' value='Entrar' />
                </form>
                <Link href='/register'>Não possui conta?</Link>
            </div>
        </div>
        <Link className={styles.linkHome} href='/'><AiFillHome/>Início</Link>
    </section>
  )
}


