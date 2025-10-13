import EmailAuth from "../../../../../components/Authorization/EmailAuth/EmailAuth"
import useUser from "../../../../../hooks/useUser"
import './ChangePasswordForm.css'

export default function ChangePasswordForm({onClose}){
    const{
        cooldownTimer,
        emailVerificationStatus,

        verifyCodeChangePassword,
        resendVerifyCodeChangePassword,
        changePassword,
    }=useUser()

    return(

        <>
        
        {
            emailVerificationStatus.status === 'code-not-success' ?(
                <EmailAuth
                    cooldownTimer={cooldownTimer}
                    verifyEmail={verifyCodeChangePassword}
                    resendVerification={resendVerifyCodeChangePassword}
                    emailAuthStatus={emailVerificationStatus}
                />
            ):emailVerificationStatus.status === 'code-success' ?(
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