import { imgs } from '@/app/api/api'
import styles from './NavBar.module.css'
import Link from 'next/link'
import ButtonLogout from '../ButtonLogout/ButtonLogout'
import { CiMenuBurger } from 'react-icons/ci'


async function NavBar({user,session}) {

  return (
    <>
        <label htmlFor='buttonNav' className={styles.buttonNavBar}>
            <CiMenuBurger/>
        </label>
        <input className={styles.check} id='buttonNav' type='checkbox' />
        <nav className={styles.nav}>
            <div className={styles.content}>
                <Link href='/' className={styles.title}><h1>Next<span>Coffee</span></h1></Link>
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