
import './BottomBar.css'
import sendMessageIcon from '../../../../../assets/img/icons/send-message.svg'
import { useState } from 'react'
import userChatInfo from '../../../../../types/messager/userChatInfo'

interface BottomBar{
    currentChat: userChatInfo|null,
    sendMessage:(message:string,chatId:string)=>void

}

export default function BottomBar({currentChat, sendMessage}:BottomBar){

    const [
        userInput, setUserInput
    ] = useState('')

    return (
        <div

            className="bottom-bar flex"
        >



            <textarea
                className="bottom-bar_user-input"
                name='user-input'
                placeholder={`Написать ${currentChat?.name||''}`}
                
                value={userInput}
                onChange={event=>setUserInput(event.currentTarget.value)}
            >

            </textarea>


            <button
                onClick={
                    currentChat
                        ?()=>{
                            sendMessage(userInput, currentChat.chat_id)
                            setUserInput('')
                        }
                        :()=>{}
                    }
                className='bottom-bar_send-message-button'
            >

                <img
                    src={sendMessageIcon}
                    className='send-message-button_icon flex center'
                    alt='send-message-button'
                />

            </button>

        </div>
    )
}