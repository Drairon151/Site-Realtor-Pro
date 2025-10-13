import { useNavigate } from 'react-router-dom';
import useUser from '../../hooks/useUser';
import './Sidebar.css'

export default function Sidebar(){
    const {
        user,
        isLoading,
    } = useUser()

    const navigate = useNavigate()

    if(isLoading || !user){
        return <p>ЗАГРУЗКА...</p>
    }

    const menuItems = []

    menuItems.push(
        { label: 'Профиль', path: '/profile' },
        { label: 'Чаты', path: '/chats' },
        { label: 'Объявления', path: '/listings' },
    );

    if(user.role == 'realtor'){
        menuItems.push(
            { label: 'Создать обьявление', path: '/listings/' },
            { label: 'Мои объявления', path: '/listings/my' },
            { label: 'Мои отзывы', path: '/reviews' },
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