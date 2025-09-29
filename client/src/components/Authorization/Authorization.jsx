import './Authorization.css'

import useAuth from "../../hooks/useAuth";

export default function Authorization(){

    const {
        isLoading,
        user,
    } = useAuth()

    return(
        <div className="flex center">
            {
                isLoading ?(
                    <p>Загрузка...</p>
                ): user ? (
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