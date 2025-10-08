import './Authorization.css'
import '../../styles/forms.css'
import { useNavigate } from 'react-router-dom';
import useAuth from "../../hooks/useAuth";
import useUser from '../../hooks/useUser';


export default function Authorization(){
  const navigate = useNavigate();

    const {
        isLoading,
    } = useAuth()

    const {
        user,
        userAuthorized,
    } = useUser()

    return(
        <div className="nav flex center">
            {
                isLoading ?(
                    <p>Загрузка...</p>
                ): userAuthorized ? (
                    <button 
                        className="nav-button nav-button_profile"
                        onClick={() => navigate('/ProfilePage')}
                    >{user.name}</button>
                ):(
                    <>

                        <button 
                            className="nav-button nav-button_registration"
                            onClick={() => navigate('/RegistrationPage')}
                        >
                            Регистрация
                        </button>

                        <button 
                            className="nav-button nav-button_login"
                            onClick={() => navigate('/LoginPage')}
                        >
                            Вход
                        </button>
                        
                    </>
                )
            }
        </div>
    )
}