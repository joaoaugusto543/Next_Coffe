import React from 'react'

export default function layoutLogin({children}) {
  return (
    <html lang='pt-br'>
        <body>
            {children}
        </body>
    </html>
  )
}

export function generateMetadata(){
  return {
    title:'Login',
    description:'Login e-commerce'
  }
}