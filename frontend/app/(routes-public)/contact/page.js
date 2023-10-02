import styles from './page.module.css'

export default function page() {
  return (
    <section className={styles.contact}>
        <h1>Contato</h1>
        <form>
            <label>
                <span>Nome:</span>
                <input type='text' placeholder='Digite seu nome'/>
            </label>
            <label>
                <span>E-mail:</span>
                <input type='email' placeholder='Digite seu e-mail'/>
            </label>
            <label>
                <span>Mensagem:</span>
                <textarea placeholder='Digite a mensagem'/>
            </label>
            <input type='submit' value='Enviar' />
        </form>
    </section>
  )
}

export function generateMetadata(){
    return {
      title:'Contato',
      description:'Contact e-commerce'
    }
}