import '@/app/globals.css'
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

export default async function LayoutAuth({ children }) {

  const session=await getServerSession(nextAuthOptions)

  if(session){
    redirect('/')
  }

 return (
    <html lang='pt-br'>
      <head>
        <link rel='icon' href='/favicon.ico' sizes='any' />
      </head>
      <body>{children}</body>
    </html>
  )
}
