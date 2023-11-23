'use client'
import styles from './ButtonLogout.module.css'
import { TbLogout2 } from 'react-icons/tb'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

function ButtonLogout() {

    const router=useRouter()

    async function handleLogout(){
        await signOut({
            redirect:false
        })

        router.replace('/login')

        return
    }

  return (
    <button className={styles.logout} onClick={handleLogout}><TbLogout2/>Sair</button>
  )
}

export default ButtonLogout