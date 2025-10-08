import { useNavigate } from 'react-router-dom';

export default function(){
    const navigate = useNavigate()
    
    return(
        <div className="sidebar">
            <button
                onClick={()=>navigate('/ChatsPage')}
                className='sidebar_nav-button'
            >
                Профиль
            </button>

            <button
                onClick={()=>navigate('/ChatsPage')}
                className='sidebar_nav-button'
            >
                Чаты
            </button>

            <button
                onClick={()=>navigate('/ChatsPage')}
                className='sidebar_nav-button'
            >
                Объявления
            </button>

        </div>
    )
}