import './Authorization.css'
import '../../styles/forms.css'
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';


export default function Authorization(){
    const navigate = useNavigate();

    const {
        user,
        userLoading,
        userAuthorized,
    } = useUserContext()
    

    return(
        <div className="nav flex">
            {
                userLoading ?(
                    <p>Загрузка...</p>
                ): userAuthorized && user ?(
                    <button 
                        className="nav-button nav-button_profile"
                        onClick={() => navigate('/profile')}
                    >{user.name}</button>
                ):(
                    <>

                        <button 
                            className="nav-button nav-button_registration"
                            onClick={() => navigate('/registration')}
                        >
                            Регистрация
                        </button>

                        <button 
                            className="nav-button nav-button_login"
                            onClick={() => navigate('/login')}
                        >
                            Вход
                        </button>
                        
                    </>
                )
            }
        </div>
    )
}