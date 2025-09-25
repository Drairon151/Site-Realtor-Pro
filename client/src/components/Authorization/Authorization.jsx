import './Authorization.css'

import useAuth from "../../hooks/useAuth";

export default function Authorization(){

    const {
        isLoading,
        currentUser,
    } = useAuth()

    return(
        <div className="flex center">
            {
                isLoading ?(
                    <p>Загрузка...</p>
                ): currentUser ? (
                    <a href="/ProfilePage">{currentUser.userName}</a>
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