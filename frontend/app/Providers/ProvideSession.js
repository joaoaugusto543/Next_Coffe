'use client'
import {SessionProvider} from 'next-auth/react'

function NextAuthProvideSession({children}) {
  return (
    <SessionProvider>
        {children}
    </SessionProvider>
  )
}

export default NextAuthProvideSession