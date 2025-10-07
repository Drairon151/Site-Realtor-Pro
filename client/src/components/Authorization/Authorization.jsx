import './Authorization.css'
import '../../styles/forms.css'

import useAuth from "../../hooks/useAuth";


export default function Authorization(){

    const {
        isLoading,
        user,
        userAuthorized,
    } = useAuth()

    return(
        <div className="nav flex center">
            {
                isLoading ?(
                    <p>Загрузка...</p>
                ): userAuthorized ? (
                    <a className="nav-button nav-button_profile" href="/ProfilePage">{user.name}</a>
                ):(
                    <>

                        <a className="nav-button nav-button_registration" href="/RegistrationPage">Регистрация</a>
                        <a className="nav-button nav-button_login" href="/LoginPage">Вход</a>
                        
                    </>
                )
            }
        </div>
    )
}