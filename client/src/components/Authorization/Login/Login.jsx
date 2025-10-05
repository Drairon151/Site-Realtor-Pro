export default function Login({login, onClose}){
    return(
            <form className="form center" onSubmit={login}>
                <label className="form_lable">Email:</label>
                <input name="mail" className="form_input" type="email"></input>

                <label className="form_lable">Пароль:</label>
                <input name="password" className="form_input" type="password"></input>

                <button type="submit" className="form_button">Отправить</button>

                <button onClick={onClose} className="form_button">✖️</button>

            </form>
    )
}