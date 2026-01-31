import { useState } from "react"
import numberPhoneValidator from "../../../utils/numberPhoneValidator"

interface RegistrationProps{
    registration: (event: React.FormEvent<HTMLFormElement>)=>{}
}

export default function Registration({registration}:RegistrationProps){
    const [numberPhoneInput, setNumberPhoneInput] = useState('')
    return(

            <form className="form center" onSubmit={registration}>
                <label className="form_lable">Фамилия:</label>
                <input name="surname" className="form_input" type="text"></input>
                <label className="form_lable">Имя:</label>
                <input name="name" className="form_input" type="text"></input>
                <label className="form_lable">Отчество:</label>
                <input name="patronymic" className="form_input" type="text"></input>

                <label className="form_lable">Email:</label>
                <input name="mail" className="form_input" type="email"></input>

                <label className="form_lable">Номер телефона:</label>
                <input 
                    name="numberPhone" 
                    className="form_input" 
                    type="text"
                    value={numberPhoneInput}

                    onChange={event=>{
                        setNumberPhoneInput(
                            numberPhoneValidator(event.currentTarget.value)
                        )
                    }}
                    placeholder="+7 (999) 123-45-67"
                ></input>

                
                <p>Кто вы?</p>
                <label className='form_lable' htmlFor='userName'>
                    Клиент:
                </label>
                <input name='role' type='radio' value='client' className="form_input" ></input>

                <label className='form_lable' htmlFor='userName'>
                    Риэлтор:
                </label>
                <input name='role' type='radio' value='realtor' className="form_input" ></input>

                <label className="form_lable">Пароль:</label>
                <input name="password" className="form_input" type="password"></input>

                <button type="submit" className="form_button">Отправить</button>
            </form>

    )
}