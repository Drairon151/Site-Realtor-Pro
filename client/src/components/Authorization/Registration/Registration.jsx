export default function Registration({registration, onClose}){
    return(
        <>
            <form id="form-auth" onSubmit={(event)=>{
                event.preventDefault()
                registration(event)
            }}>
                <label id="form-auth_lable">Имя:</label>
                <input name="userName" id="form-auth_input" type="text"></input>

                <label id="form-auth_lable">Email:</label>
                <input name="mail" id="form-auth_input" type="email"></input>

                <label id="form-auth_lable">Номер телефона:</label>
                <input name="numberPhone" id="form-auth_input" type="text"></input>

                <label id="form-auth_lable">Пароль:</label>
                <input name="password" id="form-auth_input" type="password"></input>

                <button type="submit" id="form-auth_button">Отправить</button>

                <button onClick={onClose} id="form-auth_button">✖️</button>
            </form>
        </>
    )
}