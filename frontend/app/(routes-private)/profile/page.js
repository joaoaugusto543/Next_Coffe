import { getServerSession } from 'next-auth'
import styles from './page.module.css'
import { nextAuthOptions } from '@/app/api/auth/[...nextauth]/route'
import { profile } from '@/services/userServices'
import ProfileForm from '@/components/ProfileForm/ProfileForm'

async function Profile() {

  const session=await getServerSession(nextAuthOptions)
  const user=await profile(session?.token)

  return (
    <section className={styles.profile}>
      <h1>Perfil</h1>
      <ProfileForm user={user} token={session?.token}/>
    </section>
  )
}

export default Profile