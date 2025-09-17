export default function HeaderMenuLi({nameClass,link,text}){
    return(
        <li className={nameClass}>
            <a href={link}>
                {text}
            </a>
        </li>
    )
}