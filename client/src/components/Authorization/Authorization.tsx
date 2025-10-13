import './Authorization.css'
import '../../styles/forms.css'
import { useNavigate } from 'react-router-dom';
import useUser from '../../hooks/useUser';


export default function Authorization(){
  const navigate = useNavigate();

    const {
        isLoading,
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
                        onClick={() => navigate('/profile')}
                    >{user? user.name: 'Нет данных'}</button>
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