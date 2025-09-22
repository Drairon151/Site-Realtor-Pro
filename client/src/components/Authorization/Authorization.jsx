import Button from "../Button/Button";
import Login from "./Login/Login";
import Modal from "../Modal/Modal";
import Registration from "./Registration/Registration";
import './Authorization.css'
import { useState } from "react";

export default function Authorization(){
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalFormType, setModalFormType] = useState()

    function openModalForm(formType){
        setModalFormType(formType)
        setIsModalOpen(true)
    }

    function closeModalForm(){
        setModalFormType(null)
        setIsModalOpen(false)
    }

    return(
        <div className="flex center">
            <Button buttonClick={()=>{openModalForm('register')}}>Регистрация</Button>
            <Button buttonClick={()=>{openModalForm('login')}}>Вход</Button>
            
            <Modal isOpen={isModalOpen} onClose={closeModalForm}>
                {
                    modalFormType === 'register' ?
                        <Registration onClose={closeModalForm}/> :
                            modalFormType === 'login'?
                            <Login onClose={closeModalForm}/> : null
                    
                }
            </Modal>
        </div>
    )
}