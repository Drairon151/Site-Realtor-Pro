import './ProfileUserCard.css'
import plug from '../../../../assets/img/icons/plug.png'

export default function ProfileUserCard({user,logout}){
    return(
        <div className='profile-user-card user-card flex center'>
            <div className='user-basic-info'>
                <img className='user-basic-info_avatar' src={plug}/>
                <h1 className='user-basic-info_name'>{user.userName}</h1>
                <p>Дата регистрации: 00.00.0000</p>
            </div>

            <div className='user-contact-info'>
                <div className='user-contact-info_item'>
                    <label className='user-contact-info_item--lable' htmlFor='userName'>
                        Фамилия:
                    </label>
                    <input name='surname' type='text' value={user.fullName.surname}></input>
                </div>
                <div className='user-contact-info_item'>
                    <label className='user-contact-info_item--lable' htmlFor='userName'>
                        Имя:
                    </label>
                    <input name='name' type='text' value={user.fullName.name}></input>
                </div>
                <div className='user-contact-info_item'>
                    <label className='user-contact-info_item--lable' htmlFor='userName'>
                        Отчество:
                    </label>
                    <input name='patronymic' type='text' value={user.fullName.patronymic}></input>
                </div>
                <div className='user-contact-info_item'>
                    <label className='user-contact-info_item--lable' htmlFor='userName'>
                        Почта:
                    </label>
                    <input name='mail' type='text' value={user.mail}></input>
                </div>
                <div className='user-contact-info_item'>
                    <label className='user-contact-info_item--lable' htmlFor='userName'>
                        Номер телефона:
                    </label>
                    <input name='numberPhone' type='text' value={user.numberPhone}></input>
                </div>
                <div className='user-contact-info_item'>
                    <label className='user-contact-info_item--lable' htmlFor='userName'>
                        Роль пользователя:
                    </label>
                    <input name='role' type='text' value={user.role}></input>
                </div>
            </div>

            <button className='button button_logout' onClick={logout}>Выйти из аккаунта</button>

        </div>
    )
}