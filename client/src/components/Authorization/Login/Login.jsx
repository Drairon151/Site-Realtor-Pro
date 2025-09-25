export default function Login({login, onClose}){
    return(
        <>
            <form className="form-auth" onSubmit={login}>
                <label className="form-auth_lable">Email:</label>
                <input name="mail" className="form-auth_input" type="email"></input>

                <label className="form-auth_lable">Пароль:</label>
                <input name="password" className="form-auth_input" type="password"></input>

                <button type="submit" className="form-auth_button">Отправить</button>

                <button onClick={onClose} className="form-auth_button">✖️</button>

            </form>
        </>
    )
}