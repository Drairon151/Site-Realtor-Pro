import './ProfileUserCard.css'
import plug from '../../../../assets/img/icons/plug.png'
import Modal from '../../../../components/Modal/Modal'
import ChangePasswordForm from '../ProfileComponents/ChangePasswordForm/ChangePasswordForm'
import { useEffect, useState, FormEvent } from 'react'
import useUser from '../../../../hooks/useUser'
import useAuth from '../../../../hooks/useAuth'


export default function ProfileUserCard(){    
    const {
        user,
        updateUserField,
        sendVerifyCodeChangePassword,
    } = useUser()

    const {
        logout,
    } = useAuth()

    const [isOpen, setIsOpen] = useState(false);
    const [editUser, setEditUser] = useState(user)

    useEffect(() => {
        setEditUser(user);
    }, [user]); 

    function editUserChangeOnClick(event: FormEvent<HTMLFormElement>){
        const {name, value} = event.currentTarget;
        setEditUser(prev=>{
            if(!prev){return null}

            const update = {...prev}
            update[name] = value
            return update
        },[])
    }

    function handlerUserChangeSave(event: FormEvent<HTMLFormElement>){
        const {name, value} = event.currentTarget;
        if(value.length != null && value.length != undefined){
            updateUserField(name, value)        
        }else{
            console.log('Данные пусты')
        }
    }

    return(
        <div className='profile-user-card user-card'>

            <div className='user-card_user-info flex'>

                <div className='user-basic-info'>
                    <img className='user-basic-info_avatar' src={plug}/>
                    <h1 className='user-basic-info_name'>{user? user.name :'Имя'}</h1>
                </div>

                <div className='user-contact-info'>
                    <div className='user-contact-info_item'>
                        <label className='user-contact-info_item--lable' htmlFor='surname'>
                            Фамилия:
                        </label>
                        <input 
                            className='user-contact-info_item--input' 
                            name='surname' 
                            type='text' 
                            value={editUser? editUser.surname : 'Фамилия'}
                            onChange={editUserChangeOnClick}
                            onBlur={handlerUserChangeSave}
                        ></input>
                    </div>
                    <div className='user-contact-info_item'>
                        <label className='user-contact-info_item--lable' htmlFor='name'>
                            Имя:
                        </label>
                        <input 
                            className='user-contact-info_item--input' 
                            name='name' 
                            type='text' 
                            value={editUser.name ?? 'Имя'}
                            onChange={editUserChangeOnClick}
                            onBlur={handlerUserChangeSave}
                        ></input>
                    </div>
                    <div className='user-contact-info_item'>
                        <label className='user-contact-info_item--lable' htmlFor='patronymic'>
                            Отчество:
                        </label>
                        <input 
                            className='user-contact-info_item--input' 
                            name='patronymic' 
                            type='text' 
                            value={editUser.patronymic ?? 'Отчество'}
                            onChange={editUserChangeOnClick}
                            onBlur={handlerUserChangeSave}
                        ></input>
                    </div>
                    <div className='user-contact-info_item'>
                        <label className='user-contact-info_item--lable' htmlFor='mail'>
                            Почта:
                        </label>
                        <input
                            className='user-contact-info_item--input' 
                            name='mail' 
                            type='text' 
                            value={editUser.mail ?? 'example@mail.com'}
                            onChange={editUserChangeOnClick}
                            onBlur={handlerUserChangeSave}
                        ></input>
                    </div>
                    <div className='user-contact-info_item'>
                        <label className='user-contact-info_item--lable' htmlFor='numberPhone'>
                            Номер телефона:
                        </label>
                        <input 
                            className='user-contact-info_item--input' 
                            name='numberPhone' 
                            type='text' 
                            value={editUser.numberPhone?? '+7(880)5553535'}
                            onChange={editUserChangeOnClick}
                            onBlur={handlerUserChangeSave}
                        ></input>
                    </div>


                    {
                        user.role=='admin' ? (
                            // Да сейчас тут заглушка
                            <p style={{color: 'white'}}>ВЫ АДМИН</p>
                        ):(
                            <div className='user-contact-info_item'>

                                <label className='user-contact-info_item--lable' htmlFor='role'>
                                    Клиент:
                                </label>
                                <input 
                                    className='user-contact-info_item--input-radio'
                                    name='role' 
                                    type='radio' 
                                    value='client'
                                    checked={user.role === 'client'}
                                    onChange={editUserChangeOnClick}
                                    onClick={handlerUserChangeSave}
                                ></input>

                                <label className='user-contact-info_item--lable' htmlFor='role'>
                                    Риэлтор:
                                </label>
                                <input 
                                    className='user-contact-info_item--input-radio'
                                    name='role' 
                                    type='radio' 
                                    value='realtor'
                                    checked={user.role === 'realtor'}
                                    onChange={editUserChangeOnClick}
                                    onClick={handlerUserChangeSave}
                                ></input>
                            </div>
                        )
                    }

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