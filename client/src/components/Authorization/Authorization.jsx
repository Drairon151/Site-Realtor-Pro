import './Authorization.css'

import useAuth from "../../hooks/useAuth";


export default function Authorization(){

    const {
        isLoading,
        user,
        error,
    } = useAuth()

    console.log(user)

    return(
        <div className="nav flex center">
            {
                isLoading ?(
                    <p>Загрузка...</p>
                ): !error ? (
                    <a className="nav-button nav-button_profile" href="/ProfilePage">{user.fullName.name}</a>
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