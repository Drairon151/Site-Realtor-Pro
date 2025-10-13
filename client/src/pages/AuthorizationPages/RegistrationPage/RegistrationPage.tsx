import EmailAuth from "../../../components/Authorization/EmailAuth/EmailAuth";
import Registration from "../../../components/Authorization/Registration/Registration";
import useAuth from "../../../hooks/useAuth";
import useUser from "../../../hooks/useUser";

export default function RegistrationPage(){
    const {
        registration,
        verifyEmail,
        resendVerification,

        emailAuthStatus,
    } = useAuth()

    const {
        cooldownTimer,
    } = useUser()


    return(
        <div className="registration-page auth-pages">

            <div className="auth-pages_container">

                {emailAuthStatus.status === null ?(
                    <Registration
                        registration={registration}
                    />
                ): emailAuthStatus.status === 'wait-email-conf' ?(
                    <EmailAuth
                        cooldownTimer={cooldownTimer}
                        verifyEmail={verifyEmail}
                        resendVerification={resendVerification}
                        emailAuthStatus={emailAuthStatus}
                    />
                    
                ): (
                    <p>ОШИБКА</p>
                )}

            </div>

        </div>
    )
}