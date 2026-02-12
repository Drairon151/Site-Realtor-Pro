import { UserChatData } from '../../../../types/messager/userChatData'
import userChatInfo from '../../../../types/messager/userChatInfo'
import BottomBar from './BottomBar/BottomBar'
import './ChatArea.css'
import ChatAreaMessages from './ChatAreaMessages/ChatAreaMessages'

interface ChatArea{
    sendMessage:(message:string,chatId:string)=>void
    currentChat:userChatInfo|null
    chatsMessages:Map<string,UserChatData>
}

export default function ChatArea({sendMessage, chatsMessages, currentChat}:ChatArea){
    
    return (
        <div
            className="chat-area"
        >

            <ChatAreaMessages
                currentChat={currentChat}
                chatsMessages={chatsMessages}
            />

            <BottomBar
                sendMessage={sendMessage}
                currentChat={currentChat}
            />

        </div>
        
    )
}