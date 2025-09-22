import './Button.css'

export default function Button({buttonClick, children}){
    return(
        <button
            className="button"
            onClick={buttonClick}
        >
            {children}
        </button>
    )
}