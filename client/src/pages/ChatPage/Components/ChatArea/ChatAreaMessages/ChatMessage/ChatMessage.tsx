import { Message } from '../../../../../../types/messager/message'
import './ChatMessage.css'

interface ChatMessage{
    message:Message,
    avatarUrl:string,
}

export default function ChatMessage({message,avatarUrl}:ChatMessage){
    return (
        <div
            className='chat-message flex'
        >
            <img
                className='chat-message_user-photo'
                src={avatarUrl}
            />

            <div
                className='chat-message_data'
            >

                <div
                    className='chat-message_user-data flex'
                >

                    <p
                        className='chat-message_time-stamp'
                    >{`${message.userName}`}</p>

                    <p
                        className='chat-message_time-stamp'
                    >{`${new Date(message.timeStamp).toLocaleString()}`}</p>

                </div>

                <p
                    className='chat-message_text'
                >{message.text}</p>

            </div>

        </div>
    )
}