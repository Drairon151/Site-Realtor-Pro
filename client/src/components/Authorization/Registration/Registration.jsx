export default function Registration({registration}){
    return(
        <>
            <form className="form-auth" onSubmit={registration}>
                <label className="form-auth_lable">Имя:</label>
                <input name="userName" className="form-auth_input" type="text"></input>

                <label className="form-auth_lable">Email:</label>
                <input name="mail" className="form-auth_input" type="email"></input>

                <label className="form-auth_lable">Номер телефона:</label>
                <input name="numberPhone" className="form-auth_input" type="text"></input>

                <label className="form-auth_lable">Пароль:</label>
                <input name="password" className="form-auth_input" type="password"></input>

                <button type="submit" className="form-auth_button">Отправить</button>
            </form>
        </>
    )
}