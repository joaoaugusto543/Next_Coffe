'use client'
import styles from './SecurityForm.module.css'
import { updateUser } from '@/services/userServices'
import { useState } from 'react'

function SecurityForm({token}) {

  const [password,setPassword]=useState('')
  const [newPassword,setNewPassword]=useState('')
  const [confirmPassword,setConfirmPassword]=useState('')
  const [loader,setLoader]=useState(false)
  const [error,setError]=useState('')
  const [success,setSuccess]=useState('')

  async function handleSubmit(e){
    e.preventDefault()

    setLoader(true)

    const userUpdated={
        password,
        newPassword,
        confirmPassword
    }

    const res=await updateUser(token,userUpdated)

    if(res.errors){
      setError('Ocorreu uma falha, verifique suas informações')
      setTimeout(()=>setError(''),3000)
      setLoader(false)
      return
    }

    setPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setSuccess('Senha atualizada')
    setTimeout(()=>setSuccess(''),3000)

    setLoader(false)
  }

  return (
    <>
      {success && <p className={styles.success}>{success}</p>}
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.securityForm}>
          <label>
              <span>Senha:</span>
              <input type='password' placeholder='Digite sua senha' value={password} onChange={(e)=>setPassword(e.target.value)}/>
          </label>
          <label>
              <span>Nova senha:</span>
              <input type='password' placeholder='Digite sua senha' value={newPassword} onChange={(e)=>setNewPassword(e.target.value)}/>
          </label>
          <label>
              <span>Confirme sua nova senha:</span>
              <input type='password' placeholder='Digite sua senha' value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
          </label>
          {!loader ? <input type='submit' value='Editar' /> : <input type='submit' disabled value='Aguarde...' />}
      </form>
    </>
  )
}

export default SecurityForm