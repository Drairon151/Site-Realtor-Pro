import './Header.css'
import siteLogo from '../../assets/img/icons/siteLogo.png'

import { useNavigate } from 'react-router-dom';
import Authorization from '../Authorization/Authorization'

export default function Header(){
    const navigate = useNavigate();
    
    return(
        <header className="header flex">

            <button 
                className='flex center' 
                onClick={()=>navigate('/')}
            >
                <img className="header_logo" src={siteLogo} alt="Лого"/>
                <p className="header_logo-text">Риэлтор профи</p>
            </button>

                <Authorization/>
            

        </header>
    )
}