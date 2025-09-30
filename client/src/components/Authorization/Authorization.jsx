import './Authorization.css'

import useAuth from "../../hooks/useAuth";

export default function Authorization(){

    const {
        isLoading,
        user,
        error,
    } = useAuth()

    return(
        <div className="flex center">
            {
                isLoading ?(
                    <p>Загрузка...</p>
                ): !error ? (
                    <a href="/ProfilePage">{user.userName}</a>
                ):(
                    <>

                        <a href="/RegistrationPage">Регистрация</a>
                        <a href="/LoginPage">Уже есть аккаунт</a>
                        
                    </>
                )
            }
        </div>
    )
}