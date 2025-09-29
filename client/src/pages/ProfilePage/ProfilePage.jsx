import useAuth from "../../hooks/useAuth"

export default function ProfilePage(){
    const {
        logout,
    } = useAuth()
    
    return(
        <>
        <p>Привет</p>
        <button onClick={logout}>Выйти из аккаунта</button>
        </>
    )
}