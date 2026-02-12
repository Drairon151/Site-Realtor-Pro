interface HeaderMenuLiProps {
  nameClass: string;
  link: string;
  text: string;
}


export default function HeaderMenuLi({nameClass,link,text}:HeaderMenuLiProps){
    return(
        <li className={nameClass}>
            <a href={link}>
                {text}
            </a>
        </li>
    )
}