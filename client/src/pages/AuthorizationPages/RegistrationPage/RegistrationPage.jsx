import EmailAuth from "../../../components/Authorization/EmailAuth/EmailAuth";
import Registration from "../../../components/Authorization/Registration/Registration";
import useAuth from "../../../hooks/useAuth";

export default function RegistrationPage(){
    const {
        registration,
        verifyEmail,
        resendVerification,

        cooldownTimer,
        emailAuthStatus,
    } = useAuth()


    return(
        <section className="registration-section">

            {emailAuthStatus.status === 'not-sent' ?(
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
                
            ): (null)}
            

        </section>
    )
}