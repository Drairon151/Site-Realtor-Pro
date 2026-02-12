import { useEffect, useState } from "react"
import userChatInfo from "../../../../types/messager/userChatInfo"

import './ChatBar.css'
// import useMessanger from "../../../../hooks/useMessanger"

interface ChatBar{
    changeCurrentChat: (newChat:userChatInfo)=>void,
    getChatsInfo:()=>void,
    userContacts:userChatInfo[]|undefined
    // getChatData:()=>void,
}

export default function ChatBar({changeCurrentChat, getChatsInfo,  userContacts}:ChatBar){


    const [chats, setChats] = useState<userChatInfo[]>([
        {
            name:'Ремулечка',
            chat_id:'adsuh21asd',
            avatar_url:'https://ir.ozone.ru/s3/multimedia-1-b/c1000/7052105675.jpg'
        },
        {
            name:'Мегушмин',
            chat_id:'ывар12',
            avatar_url:'https://i.pinimg.com/736x/b4/bb/50/b4bb50536d3e9243e079ec167dbe8d6f.jpg'
        },
    ])

    useEffect(()=>{
        getChatsInfo()
    },[])
    
    return(
        <div
            className="chat-bar"
        >
            <ul
                className="chat-bar_button-list"
            >

                {
                    userContacts?.map(chat=>(
                        <li
                            className="chat-bar-list_item"
                            key={chat.chat_id}
                        >
                            <button
                                className="chat-bar-button flex"
                                onClick={()=>changeCurrentChat(chat)}
                            >

                                <img
                                    className="chat-bar-button--avatar"
                                    src={chat.avatar_url}
                                />

                                <p
                                    className="chat-bar-button--user-name flex center"
                                >
                                    {chat.name}
                                </p>

                            </button>

                        </li>
                    ))
                }
            </ul>

        </div>
    )
}