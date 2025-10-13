import {createPortal} from 'react-dom'
import React, { useRef, useEffect } from 'react'

import './Modal.css'

interface ModalProps{
    children: React.ReactNode;
    isOpen: boolean,
}

export default function Modal({children, isOpen}:ModalProps){
    const dialog = useRef<HTMLDialogElement>(null)

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

        document.getElementById('modal')!
    )
}