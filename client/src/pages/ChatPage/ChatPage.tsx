import useMessanger from "../../hooks/useMessanger";
import ChatArea from "./Components/ChatArea/ChatArea";
import ChatBar from "./Components/ChatBar/ChatBar";

import './ChatPage.css'

export default function ChatPage(){

    const {
        getChatsInfo,
        getChatData,
        changeCurrentChat,
        sendMessage,
        
        userContacts,
        currentChat,
        chatsMessages,
    } = useMessanger()
    
    return (
        <div
            className="chat-page flex"
        >
            <ChatBar
                // getChatData={getChatData}
                userContacts={userContacts}
                getChatsInfo={getChatsInfo}
                changeCurrentChat={changeCurrentChat}
            />

            <ChatArea
                sendMessage={sendMessage}
                currentChat = {currentChat}
                chatsMessages = {chatsMessages}
            />            

        </div>
    )
}