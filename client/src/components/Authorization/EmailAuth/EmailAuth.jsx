import useAuth from "../../../hooks/useAuth"

export default function EmailAuth({cooldownTimer, verifyEmail, resendVerification, emailAuthStatus}){
    
    return(
        <form className="form-auth" onSubmit={verifyEmail}>

            <h1>Пожалуйста проверьте почту</h1>

            <label className="form-auth_lable">Код подтверждения:</label>
            <input name="emailCode" className="form-auth_input" type="number"></input>

            {
                emailAuthStatus.type === 'wait'? (
                    null
                ): emailAuthStatus.type === 'invalid_code' ?(
                    <p>Неверный код</p>
                ): emailAuthStatus.type === 'code_expired' ?(
                    <p>Неверный код</p>
                ):(
                    <p>Что то пошло не так, попробуйте отправит заново</p>
                )
            }

            <div>
                <button type="submit" className="form-auth_button">Отправить</button>
                
                {
                    cooldownTimer <= 0 ?(
                        <button 
                            type="button" 
                            onClick={resendVerification} 
                            className="form-auth_button"
                        >
                            Прислать новый код
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