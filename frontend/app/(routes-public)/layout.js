import NavBar from '@/components/NavBar/NavBar'
import React from 'react'
import NextAuthProvideSession from '../Providers/ProvideSession'
import '@/app/globals.css'


export const metadata = {
  title: 'NextCoffe',
  description: 'NextCoffe',
}

async function layout({children}) {

  return (
    <html lang='pt-br'>
      <body>
        <NextAuthProvideSession>
          <NavBar/>
          {children}
        </NextAuthProvideSession>
      </body>
    </html>
  )
}

export default layout