import { useNavigate } from 'react-router-dom';
import './Sidebar.css'
import { useUserContext } from '../../context/UserContext';

export default function Sidebar(){
    const {
        user,
        isLoading,
    } = useUserContext()

    const navigate = useNavigate()

    if(isLoading || !user){
        return <p>ЗАГРУЗКА...</p>
    }

    const menuItems = []

    menuItems.push(
        { label: 'Профиль', path: '/profile' },
        { label: 'Чаты', path: '/chat' },
        { label: 'Объявления', path: '/listings' },
        { label: 'Риелторы', path: '/realtors'}
    );

    if(user.role == 'realtor'){
        menuItems.push(
            { label: 'Создать обьявление', path: '/listing/new' },
            { label: 'Мои объявления', path: '/listings/my' },
        );
    }

    if(user.role == 'admin'){
        menuItems.push(
            { label: 'Верификация', path: '/admin/verification' },
        );
    }

    return(
        <div className='sidebar'>

        {
            menuItems.map(button=>(
                <button
                    key={button.path}
                    className='sidebar_nav-button'
                    onClick = {()=>navigate(button.path)}
                >
                    {button.label}
                </button>
            ))
        }

        </div>
    )

}