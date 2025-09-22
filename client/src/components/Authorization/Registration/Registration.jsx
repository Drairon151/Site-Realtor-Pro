export default function Registration({userRegistration}){
    return(
        <>
            <form id="form-auth">
                <label id="form-auth_lable">Имя:</label>
                <input id="form-auth_input" type="text"></input>

                <label id="form-auth_lable">Email:</label>
                <input id="form-auth_input" type="email"></input>

                <label id="form-auth_lable">Номер телефона:</label>
                <input id="form-auth_input" type="number"></input>

                <label id="form-auth_lable">Пароль:</label>
                <input id="form-auth_input" type="password"></input>

                <button id="form-auth_button">Отправить</button>

                {/* <input id="form-auth_input"  type="button">Отправить</input> */}
            </form>
        </>
    )
}