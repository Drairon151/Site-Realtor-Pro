import {createPortal} from 'react-dom'
import './Modal.css'
import { useRef, useEffect } from 'react'

export default function Modal({children,isOpen, isClose}){
    const dialog = useRef(null)

    useEffect(
        ()=>{
            if(isOpen  && dialog.current){
                dialog.current.showModal()
            }else if(!isOpen  && dialog.current){
                dialog.current.close()
            }
        },
        [isOpen]
    )


    return createPortal(
        <dialog 
                ref={dialog}
                className="modal-dialog"
        >
            {children }
        </dialog>,

        document.getElementById('modal')
    )
}