import Registration from "../../../components/Authorization/Registration/Registration";
import useAuth from "../../../hooks/useAuth";

export default function RegistrationPage(){
    const {
        registration,
    } = useAuth()


    return(
        <section className="registration-section">
            <Registration
                login={registration}
                onClose={()=>console.log('plug')}
            />

        </section>
    )
}