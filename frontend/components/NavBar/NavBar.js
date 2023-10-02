import { imgs } from '@/app/api/api'
import styles from './NavBar.module.css'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from '@/app/api/auth/[...nextauth]/route'
import ButtonLogout from '../ButtonLogout/ButtonLogout'

async function NavBar() {

    const session=await getServerSession(nextAuthOptions)

  return (
    <nav className={styles.nav}>
        <div className={styles.content}>
            <h1 className={styles.title}>Next<span>Coffee</span></h1>
            <ul className={styles.navLinks}>
                <li><Link href='/'>Home</Link></li>
                <li><Link href='/about'>Sobre</Link></li>
                <li><Link href='/contact'>Contato</Link></li>
                {session && (
                    <>
                        <li><Link href='/'>Favoritos</Link></li>
                        <li><Link href='/'>Histórico</Link></li>
                        <li><Link href='/'>Segurança</Link></li>
                    </>
                )}
            </ul>
            {!session && <Link className={styles.toEnter} href='/login'><img src={`${imgs}/anonimo.png`} alt='anônimo' />Entrar</Link>}
            {session && 
                <div className={styles.navBarAuth}>
                    <Link href='/profile' className={styles.linkProfile}><img src={`${imgs}/${session.user.image}`} alt={session.user.image} />{session.user.name}</Link>
                    <ButtonLogout/>
                </div>
            }
        </div>
    </nav>
  )
}

export default NavBar