import React from 'react'

export default function layoutRegister({children}) {
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
    title:'Cadastro',
    description:'Register e-commerce'
  }
}