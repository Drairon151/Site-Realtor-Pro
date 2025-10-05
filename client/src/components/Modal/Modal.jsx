import {createPortal} from 'react-dom'
import { useRef, useEffect } from 'react'

import './Modal.css'

export default function Modal({children, isOpen}){
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
            {children}
        </dialog>,

        document.getElementById('modal')
    )
}