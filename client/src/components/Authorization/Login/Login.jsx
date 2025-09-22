export default function Login({userLogin}){
    return(
        <>
            <form id="form-auth">
                <label id="form-auth_lable">Email:</label>
                <input id="form-auth_input" type="email"></input>

                <label id="form-auth_lable">Пароль:</label>
                <input id="form-auth_input" type="password"></input>

                <button id="form-auth_button">Отправить</button>

            </form>
        </>
    )
}