import { useEffect } from "react"
import EmailAuth from "../../../../../components/Authorization/EmailAuth/EmailAuth"
import useAuth from "../../../../../hooks/useAuth"
import './ChangePasswordForm.css'

export default function ChangePasswordForm({onClose}){
    const{
        user,
        cooldownTimer,
        emailAuthStatus,

        verifyCodeChangePassword,
        resendVerifyCodeChangePassword,
        changePassword,
    }=useAuth()

    console.log(emailAuthStatus)

    return(

        <>
        
        {
            emailAuthStatus.status === null ?(
                <EmailAuth
                    cooldownTimer={cooldownTimer}
                    verifyEmail={verifyCodeChangePassword}
                    resendVerification={resendVerifyCodeChangePassword}
                    emailAuthStatus={emailAuthStatus}
                />
            ):emailAuthStatus.status === 'code-success' ?(
                <form onSubmit={changePassword} className="form change-password-form">
                    <label className="form_lable change-password-form_lable" htmlFor="oldPassword">Ваш актуальный пароль</label>
                    <input className="form_input change-password-form_input" name="oldPassword" type="password"></input>

                    <label className="form_lable change-password-form_lable" htmlFor="newPassword">Ваш новый пароль</label>
                    <input className="form_input change-password-form_input" name="newPassword" type="password"></input>

                    <button className="form_button change-password-form_button" type="submit">Подтвердить</button>
                </form>
            ):(null)
        }
            <button onClick={onClose}>✖️</button>

        </>

    )
}