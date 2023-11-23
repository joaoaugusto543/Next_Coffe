'use client'
import { imgs } from '@/app/api/api'
import styles from './NavBar.module.css'
import Link from 'next/link'
import ButtonLogout from '../ButtonLogout/ButtonLogout'
import { CiMenuBurger } from 'react-icons/ci'
import { useState } from 'react'

async function NavBar({user,session}) {

    const [navBar,setNavBar]=useState('close')

    function closeNavBar(){
        setNavBar('close')
    }

    function openNavBar(){
        setNavBar('open')
    }
    
  return (
    <>
        {navBar !== 'open' ? <button onClick={openNavBar} className={styles.buttonNavBar}><CiMenuBurger/></button> : <button onClick={closeNavBar} className={styles.buttonNavBar}><CiMenuBurger/></button>}
        <nav className={styles.nav}>
            <div className={styles.content}>
                <h1 className={styles.title}>Next<span>Coffee</span></h1>
                <ul className={styles.navLinks}>
                    <li><Link href='/'>Home</Link></li>
                    <li><Link href='/about'>Sobre</Link></li>
                    <li><Link href='/contact'>Contato</Link></li>
                    {user &&
                        <>
                            <li><Link href='/favorites'>Favoritos</Link></li>
                            <li><Link href='/historics'>Histórico</Link></li>
                            <li><Link href='/security'>Segurança</Link></li>
                        </>
                    }
                    {session?.user.admin && 
                        <>
                            <li><Link href='/create-admin'>Criar admin</Link></li>
                            <li><Link href='/create-product'>Criar produto</Link></li>
                        </>
                    }
                </ul>
                {!user && <Link className={styles.toEnter} href='/login'><img src={`${imgs}/anonimo.png`} alt='anônimo' />Entrar</Link>}
                {user && 
                    <div className={styles.navBarAuth}>
                        <Link href='/profile' className={styles.linkProfile}><img src={`${imgs}/${user.image}`} alt={user.image} />{user.name}</Link>
                        <ButtonLogout/>
                    </div>
                }
            </div>
        </nav>
    </>
  )
}

export default NavBar