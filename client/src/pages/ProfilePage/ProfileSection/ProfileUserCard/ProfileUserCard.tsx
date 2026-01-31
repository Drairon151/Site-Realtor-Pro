import './ProfileUserCard.css'
import Modal from '../../../../components/Modal/Modal'
import ChangePasswordForm from '../ProfileComponents/ChangePasswordForm/ChangePasswordForm'
import ChangeUserPhotoForm from '../ProfileComponents/ChangeUserPhotoForm/ChangeUserPhotoForm'
import { useEffect, useState } from 'react'

import { User } from '../../../../types/user'

import avatarChangeIcon from '../../../../assets/img/icons/edit-pen.svg'
import userAvatarPlug from '../../../../assets/img/icons/userAvatarPlug.svg'
import numberPhoneValidator from '../../../../utils/numberPhoneValidator'

interface ProfileUserCardProps{
    user: User,
    updateUserField: (name:string, value:string)=>void,
    sendVerifyCodeChangePassword: ()=>void,
    
    logout: ()=>void,
}


export default function ProfileUserCard({user, updateUserField, sendVerifyCodeChangePassword, logout}:ProfileUserCardProps){    

    const [emailChangeIsOpen, setEmailChangeIsOpen] = useState(false);
    const [photoChangeIsOpen, setPhotoChangeIsOpen] = useState(false);

    const [editUser, setEditUser] = useState<User>(user)
    const [userAvatarOver,setUserAvatarOver] = useState(false)
    const [userAvatarClick,setUserAvatarClick] = useState(false)

    useEffect(() => {
        setEditUser({...user,['numberPhone']:numberPhoneValidator(user.numberPhone)});
    }, [user]); 

    const [userAvatar, setUserAvatar] = useState(
        
        user.avatarUrl ?? userAvatarPlug
        
    )

    const userAvatarLoadErrorHandler = ()=>{
        setUserAvatar(userAvatarPlug)
    }



    function editUserChange(event: React.ChangeEvent<HTMLInputElement>){

        const allowedFields = ['name', 'surname', 'patronymic', '_id', 'role', 'mail', 'numberPhone'] as const;
        type StringField = typeof allowedFields[number];
        


        const isStringField = (key: string): key is StringField => {
            return allowedFields.includes(key as StringField);
        };


        const {name, value} = event.currentTarget;

        setEditUser(prev=>{
            const update = {...prev}
            
            if(isStringField(name)){
                if(name == 'numberPhone'){
                    update[name] = numberPhoneValidator(value)
                }else{
                    update[name] = value
                }
            }
            return update
        })
    }


    function handlerUserChangeSave(event: React.FocusEvent<HTMLInputElement>){
        const {name, value} = event.currentTarget;
        if(value.length != null){
            updateUserField(name, value)        
        }else{
            console.log('Данные пусты')
        }
    }

    function handleRadioChangeSave(event: React.ChangeEvent<HTMLInputElement>){
        const value = event.currentTarget.value;

        setEditUser(prev=>({
            ...prev,
            ['role'] : value,
        }))
        updateUserField('role', value)      
    }

    return(
        <div className='profile-user-card user-card'>

            <div className='user-card_user-info flex'>

                <div className='user-basic-info'>
                    <div
                        className='user-basic-info_avatar'
                        onMouseOver={()=>setUserAvatarOver(true)}
                        onMouseOut={()=>setUserAvatarOver(false)}
                        onClick={
                            ()=>userAvatarClick ? setUserAvatarClick(false) : setUserAvatarClick(true)
                        }
                    >
                        <img 
                            className={`user-basic-info_avatar--img  ${userAvatarOver?'active':null}`} 
                            src={
                                userAvatar
                            }
                            onError={
                                userAvatarLoadErrorHandler
                            }
                        />

                        {
                            userAvatarOver
                                ? 
                                    <img
                                        className='user-avatar_change-icon'
                                        src={avatarChangeIcon}
                                    />
                                : null
                        }

                        {
                            userAvatarClick
                                ?
                                    <button
                                        className='change-avatar-button'
                                        onClick={()=>setPhotoChangeIsOpen(true)}
                                    >
                                        Изменение аватара
                                    </button>
                                : null
                        }

                    </div>
                    <h1 className='user-basic-info_name'>{user.name ?? 'Имя'}</h1>
                </div>

                <div className='user-contact-info'>

                    <h2>Общая информация</h2>

                    <div className='user-contact-info_item'>
                        <label className='user-contact-info_item--lable' htmlFor='user-contact-info_item--surname'>
                            Фамилия:
                        </label>
                        <input 
                            id='user-contact-info_item--surname'
                            className='user-contact-info_item--input' 
                            name='surname' 
                            type='text' 
                            value={editUser.surname ?? 'Фамилия'}
                            onChange={editUserChange}
                            onBlur={handlerUserChangeSave}
                        ></input>
                    </div>
                    <div className='user-contact-info_item'>
                        <label className='user-contact-info_item--lable' htmlFor='user-contact-info_item--name'>
                            Имя:
                        </label>
                        <input 
                            id='user-contact-info_item--name'
                            className='user-contact-info_item--input' 
                            name='name' 
                            type='text' 
                            value={editUser.name ?? 'Имя'}
                            onChange={editUserChange}
                            onBlur={handlerUserChangeSave}
                        ></input>
                    </div>
                    <div className='user-contact-info_item'>
                        <label className='user-contact-info_item--lable' htmlFor='user-contact-info_item--patronymic'>
                            Отчество:
                        </label>
                        <input 
                            id='user-contact-info_item--patronymic'
                            className='user-contact-info_item--input' 
                            name='patronymic' 
                            type='text' 
                            value={editUser.patronymic ?? 'Отчество'}
                            onChange={editUserChange}
                            onBlur={handlerUserChangeSave}
                        ></input>
                    </div>
                    <div className='user-contact-info_item'>
                        <p
                            className='user-contact-info_item--text' 
                        ><span
                            className='user-contact-info_item--lable'
                        >Почта: </span>{editUser.mail}</p>
                    </div>
                    <div className='user-contact-info_item'>
                        <label className='user-contact-info_item--lable' htmlFor='user-contact-info_item--numberPhone'>
                            Номер телефона:
                        </label>
                        <input 
                            id='user-contact-info_item--numberPhone'
                            className='user-contact-info_item--input'
                            name='numberPhone' 
                            type='text' 
                            value={editUser.numberPhone?? '+7(880)5553535'}
                            onChange={editUserChange}
                            onBlur={handlerUserChangeSave}
                        ></input>
                    </div>


                    {
                        user!.role=='admin' ? (
                            <p style={{color: 'white'}}>АДМИНИСТРАТОР</p>
                        ):(
                            <div className='user-contact-info_item'>

                                <label className='user-contact-info_item--lable' htmlFor='user-contact-info_item--client'>
                                    Клиент:
                                </label>
                                <input 
                                    id='user-contact-info_item--client'
                                    className='user-contact-info_item--input-radio'
                                    name='role' 
                                    type='radio' 
                                    value='client'
                                    checked={editUser.role === 'client'}
                                    onChange={handleRadioChangeSave}
                                ></input>

                                <label className='user-contact-info_item--lable' htmlFor='user-contact-info_item--realtor'>
                                    Риэлтор:
                                </label>
                                <input 
                                    id='user-contact-info_item--realtor'
                                    className='user-contact-info_item--input-radio'
                                    name='role' 
                                    type='radio' 
                                    value='realtor'
                                    checked={editUser.role === 'realtor'}
                                    onChange={handleRadioChangeSave}
                                ></input>
                            </div>
                        )
                    }

                </div>



            </div>

            <div className='user-card_buttons'>
                <button className='user-card_button user-card_button--changePassword' 
                    onClick={()=>{
                        setEmailChangeIsOpen(true);
                        sendVerifyCodeChangePassword()
                    }}
                >
                    Смена пароля</button>
                <button className='user-card_button user-card_button--logout' onClick={logout}>Выйти из аккаунта</button>
            </div>

            <Modal
                isOpen={emailChangeIsOpen}
            >
                    <ChangePasswordForm onClose={()=>{
                        setEmailChangeIsOpen(false)
                    }}/>
            </Modal>

            <Modal
                isOpen={photoChangeIsOpen}
            >
                    <ChangeUserPhotoForm onClose={()=>{
                        setPhotoChangeIsOpen(false)
                    }}/>
            </Modal>

        </div>
    )
}