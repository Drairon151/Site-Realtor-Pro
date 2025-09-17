import './Header.css'
import { menuItems } from "../../data"

import HeaderMenuLi from "../headerMenuLi"
import Button from "../Button/Button"
import AuthSection from '../AuthSection'

export default function Header(){
    return(
        <header className="header flex">

            <a className='flex center' href="#">
                <img className="header_logo" src="" alt="Лого"/>
                <p className="header_logo-text">Бизнес профи</p>
            </a>

            <ul className="header_menu flex center">
                {menuItems.map(item=>(
                    <HeaderMenuLi 
                                nameClass={item.nameClass}
                                link={item.link}
                                text={item.text}
                    ></HeaderMenuLi>
                ))}
            </ul>

            {
                true && <AuthSection/>
            }

        </header>
    )
}