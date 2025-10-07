import './ProfileUserCard.css'
import plug from '../../../../assets/img/icons/plug.png'
import Modal from '../../../../components/Modal/Modal'
import ChangePasswordForm from '../ProfileComponents/ChangePasswordForm/ChangePasswordForm'
import { useEffect, useState } from 'react'

export default function ProfileUserCard({user, logout, sendVerifyCodeChangePassword}){
    const [isOpen, setIsOpen] = useState(false);

    const [editUser, setEditUser] = useState(user)

    function editUserChangeOnClick(event){
        const {name, value} = event.target;
        setEditUser(prev=>{
            const update = {...prev}
            update[name] = value
            return update
        },[])
    }

    function editUserSaveOnBlur(event){
        console.log('Разблюр')
    }

    return(
        <div className='profile-user-card user-card'>

            <div className='user-card_user-info flex'>

                <div className='user-basic-info'>
                    <img className='user-basic-info_avatar' src={plug}/>
                    <h1 className='user-basic-info_name'>{user.name}</h1>
                </div>

                <div className='user-contact-info'>
                    <div className='user-contact-info_item'>
                        <label className='user-contact-info_item--lable' htmlFor='userName'>
                            Фамилия:
                        </label>
                        <input 
                            className='user-contact-info_item--input' 
                            name='surname' 
                            type='text' 
                            value={editUser.surname}
                            onChange={editUserChangeOnClick}
                            onBlur={editUserSaveOnBlur}
                        ></input>
                    </div>
                    <div className='user-contact-info_item'>
                        <label className='user-contact-info_item--lable' htmlFor='userName'>
                            Имя:
                        </label>
                        <input 
                            className='user-contact-info_item--input' 
                            name='name' 
                            type='text' 
                            value={editUser.name}
                            onChange={editUserChangeOnClick}
                            onBlur={editUserSaveOnBlur}
                        ></input>
                    </div>
                    <div className='user-contact-info_item'>
                        <label className='user-contact-info_item--lable' htmlFor='userName'>
                            Отчество:
                        </label>
                        <input 
                            className='user-contact-info_item--input' 
                            name='patronymic' 
                            type='text' 
                            value={editUser.patronymic}
                            onChange={editUserChangeOnClick}
                            onBlur={editUserSaveOnBlur}
                        ></input>
                    </div>
                    <div className='user-contact-info_item'>
                        <label className='user-contact-info_item--lable' htmlFor='userName'>
                            Почта:
                        </label>
                        <input
                            className='user-contact-info_item--input' 
                            name='mail' 
                            type='text' 
                            value={editUser.mail}
                            onChange={editUserChangeOnClick}
                            onBlur={editUserSaveOnBlur}
                        ></input>
                    </div>
                    <div className='user-contact-info_item'>
                        <label className='user-contact-info_item--lable' htmlFor='userName'>
                            Номер телефона:
                        </label>
                        <input 
                            className='user-contact-info_item--input' 
                            name='numberPhone' 
                            type='text' 
                            value={editUser.numberPhone}
                            onChange={editUserChangeOnClick}
                            onBlur={editUserSaveOnBlur}
                        ></input>
                    </div>
                    <div className='user-contact-info_item'>
                        <label className='user-contact-info_item--lable' htmlFor='userName'>
                            Роль пользователя:
                        </label>
                        <input 
                            className='user-contact-info_item--input' 
                            name='role' 
                            type='text' 
                            value={editUser.role}
                            onChange={editUserChangeOnClick}
                            onBlur={editUserSaveOnBlur}
                        ></input>
                    </div>
                </div>

            </div>

            <div className='user-card_buttons'>
                <button className='user-card_button user-card_button--changePassword' onClick={()=>{
                    setIsOpen(true);
                    sendVerifyCodeChangePassword()
                    
                }}>Смена пароля</button>
                <button className='user-card_button user-card_button--logout' onClick={logout}>Выйти из аккаунта</button>
            </div>

            <Modal
                isOpen={isOpen}
            >
                    <ChangePasswordForm onClose={()=>{
                        setIsOpen(false)
                    }}/>
            </Modal>

        </div>
    )
}