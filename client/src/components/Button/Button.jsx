import './Button.css'

export default function Button({onCLick, children}){
    return(
        <button 
            className="button"
            onClick={onCLick}
        >
            {children}
        </button>
    )
}