// import { useState } from 'react'

import { useUserContext } from '../../../../../context/UserContext'
import { UserChatData } from '../../../../../types/messager/UserChatData'
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

    return (
        <div className='chat-area_messages'>
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
        </div>
    );
}