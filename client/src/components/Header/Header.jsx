import './Header.css'
import siteLogo from '../../assets/img/icons/siteLogo.png'

import { menuItems } from "../../data/menuItems"

import HeaderMenuLi from "../headerMenuLi"
import Authorization from '../Authorization/Authorization'

export default function Header(){
    return(
        <header className="header flex">

            <a className='flex center' href="#">
                <img className="header_logo" src={siteLogo} alt="Лого"/>
                <p className="header_logo-text">Риэлтор профи</p>
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

                <Authorization/>
            

        </header>
    )
}