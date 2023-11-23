import NavBar from '@/components/NavBar/NavBar'
import React from 'react'
import NextAuthProvideSession from '../Providers/ProvideSession'
import '@/app/globals.css'
import Cart from '@/components/Cart/Cart'
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from '../api/auth/[...nextauth]/route'
import { getHistoricOpen } from '@/services/historicServices'
import { redirect } from 'next/navigation'
import { profile } from '@/services/userServices'


export const metadata = {
  title: 'NextCoffe',
  description: 'NextCoffe',
}

async function layout({children}) {

  
  const session=await getServerSession(nextAuthOptions)

  const cart=await getHistoricOpen(session?.token)

  const user=await profile(session?.token)

  if(!session){
    redirect('/login')
  }

  if(!session.user.admin){
    redirect('/')
  }

  return (
    <html lang='pt-br'>
      <head>
        <link rel='icon' href='/favicon.ico' sizes='any' />
      </head>
      <body>
        <NextAuthProvideSession>
          <NavBar session={session} user={user}/>
          {children}
          {session && <Cart session={session} onCart={cart}/>}
        </NextAuthProvideSession>
      </body>
    </html>
  )
}

export default layout