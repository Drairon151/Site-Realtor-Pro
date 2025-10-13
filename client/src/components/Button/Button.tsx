import './Button.css'

interface ButtonProps{
    buttonClick: ()=>{}, 
    children: React.ReactNode;
}

export default function Button({buttonClick, children}:ButtonProps){
    return(
        <button
            className="button"
            onClick={buttonClick}
        >
            {children}
        </button>
    )
}