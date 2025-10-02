export default function Registration({registration}){
    
    return(

            <form className="form-auth center" onSubmit={registration}>
                <label className="form-auth_lable">Фамилия:</label>
                <input name="surname" className="form-auth_input" type="text"></input>
                <label className="form-auth_lable">Имя:</label>
                <input name="name" className="form-auth_input" type="text"></input>
                <label className="form-auth_lable">Отчество:</label>
                <input name="patronymic" className="form-auth_input" type="text"></input>

                <label className="form-auth_lable">Email:</label>
                <input name="mail" className="form-auth_input" type="email"></input>

                <label className="form-auth_lable">Номер телефона:</label>
                <input name="numberPhone" className="form-auth_input" type="text"></input>

                
                <p>Кто вы?</p>
                <label className='form-auth_lable' htmlFor='userName' value="client">
                    Клиент:
                </label>
                <input name='role' type='radio' value='client' className="form-auth_input" ></input>

                <label className='form-auth_lable' htmlFor='userName'>
                    Риэлтор:
                </label>
                <input name='role' type='radio' value='realtor' className="form-auth_input" ></input>

                <label className="form-auth_lable">Пароль:</label>
                <input name="password" className="form-auth_input" type="password"></input>

                <button type="submit" className="form-auth_button">Отправить</button>
            </form>

    )
}