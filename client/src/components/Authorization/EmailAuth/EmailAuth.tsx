import './EmailAuth.css'
import { EmailStatus } from '../../../types/emailStatus'
interface EmailAuthProps{
    cooldownTimer: number, 
    verifyEmail:(event: React.FormEvent<HTMLFormElement>)=>void , 
    resendVerification: (event: React.MouseEvent<HTMLButtonElement>) => void, 
    emailAuthStatus:EmailStatus,
}

export default function EmailAuth(
    {   cooldownTimer, 
        verifyEmail, 
        resendVerification, 
        emailAuthStatus
    }:EmailAuthProps){
    
    return(
        <form className="form emal-auth-form" onSubmit={verifyEmail}>

            <h1>Подтвердите действие, проверьте почту</h1>

            <label className="form_lable">Код подтверждения:</label>
            <input name="emailCode" className="form_input" type="number"></input>

            {
                emailAuthStatus.type === 'wait' ?(
                    null
                ): emailAuthStatus.type === 'invalid_code' ?(
                    <p>Неверный код</p>
                ): emailAuthStatus.type === 'code_expired' ?(
                    <p>Код просрочен</p>
                ):(
                    <p>Что то пошло не так, попробуйте отправит заново</p>
                )
            }

            <div className='emal-auth-form_buttons'>
                <button type="submit" className="form_button emal-auth-form_button">Отправить</button>
                
                {
                    cooldownTimer <= 0 ?(
                        <button 
                            type="button" 
                            onClick={resendVerification} 
                            className="form_button emal-auth-form_button"
                        >
                            Прислать код
                        </button>
                    ):(
                        <div>
                            Пожалуйста, подождите {cooldownTimer} секунд
                        </div>
                    )
                }




            </div>

        </form>
    )
}