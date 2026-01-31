import { useState ,useEffect, useRef } from 'react'
import { useUserContext } from '../../../../../context/UserContext'
import { UserChatData } from '../../../../../types/messager/userChatData'
import userChatInfo from '../../../../../types/messager/userChatInfo'
import './ChatAreaMessages.css'
import ChatMessage from './ChatMessage/ChatMessage'

interface ChatAreaMessages{
    chatsMessages:Map<string,UserChatData>
    currentChat:userChatInfo|null,
}

export default function ChatAreaMessages({ chatsMessages, currentChat }: ChatAreaMessages) {    
    if (!currentChat) {
        return <p style={{ color: 'white' }}>Не выбран чат</p>;
    }

    const chatData = chatsMessages.get(currentChat.chat_id);
    if (!chatData) {
        return <p style={{ color: 'white' }}>Нету данных чата</p>;
    }

    const {user} = useUserContext()

    const messagesStartRef = useRef<HTMLDivElement>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [userOnLastMessage, setUserOnLastMessage] = useState(true)

    const chatScrollHandler = ()=>{
        if(!messagesStartRef.current || !messagesEndRef.current)return
        messagesStartRef.current.scrollTop = messagesStartRef.current.scrollHeight
    }

    const isScrolledToBottom = () => {
        if(!messagesStartRef.current || !messagesEndRef.current)return
        
        setUserOnLastMessage(
            messagesStartRef.current.scrollTop
            +
            messagesStartRef.current.clientHeight 
            >= 
            messagesStartRef.current.scrollHeight - 1
        )
    };

    useEffect(()=>{
        if(userOnLastMessage){
            chatScrollHandler()
        }
    },[chatData.chatHistory])

    return (
        <div className='chat-area_messages'
            ref={messagesStartRef}
            onScroll={isScrolledToBottom}
        >
            {chatData.chatHistory.map(message => (
                <ChatMessage
                    key={message.messageId}
                    message={message}
                    avatarUrl={
                        message.userID === user?._id
                            ? user.avatarUrl ?? ''
                            : currentChat.avatar_url ?? ''
                    }
                />
            ))}
            <div
                ref={messagesEndRef}
            ></div>
        </div>
    );
}