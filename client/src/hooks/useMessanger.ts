import { useState,useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import userChatInfo from "../types/messager/userChatInfo";
import { useNavigate } from "react-router-dom";
import ChatMessage from "../pages/ChatPage/Components/ChatArea/ChatAreaMessages/ChatMessage/ChatMessage";
import { UserChatData } from "../types/messager/userChatData";

export default function useMessanger(){
    const WEB_SOCKET_URL = 'ws://localhost:5000/ws/chat'
    const API_MESSAGER = 'http://localhost:5000/api/messager'
    const [connectionStatus, setConnectionStatus] = useState(3)
    // const [chatsMessages, setChatsMessages] = useState<Record<string, UserChatData>>({})
    const [chatsMessages, setChatsMessages] = useState<Map<string,UserChatData>>(new Map())
    const [userContacts, setUserContacts] = useState<userChatInfo[]>()
    const [currentChat, setCurrentChat] = useState<userChatInfo|null>(null)

    const WS = useRef<WebSocket|null>(null);
    
    const navigate = useNavigate();

    const [chatSearchParams, setChatSearchParams] = useSearchParams();
    
    const currentChatParams = {
        chatId: chatSearchParams.get('chatId') || '',
    };

    const startConnection = async ()=>{
        try{
            if (WS.current?.readyState === WebSocket.OPEN) return;
            console.log('Старт подключения!')

            WS.current = new WebSocket(WEB_SOCKET_URL);

            setConnectionStatus(WS.current.readyState)


            WS.current.addEventListener('message', event => getMessage(event));
        
            WS.current.addEventListener('error', event => errorConnection(event));

        }catch(error){

        }
    }

    const closeConnection = ()=>{
        if(!WS.current){return 'Такого соединения нет'}
        WS.current.close()
    }

    const errorConnection = (event: ErrorEventInit)=>{
        console.log('Ошибка соединения: ',event.message)
    }
    
    const getMessage = (event: MessageEvent) => {
        try {
            const data = JSON.parse(event.data);
            console.log('📩 Получено сообщение:', data);

            setChatsMessages(prev => {
            const chatId = data.chatId;
            const existingChat = prev.get(chatId);

            if (!existingChat) {
                console.warn('⚠️ Получено сообщение для неизвестного чата:', chatId);
                return prev;
            }

            const updatedHistory = [...existingChat.chatHistory, data.message];

            const updatedChat = {
                ...existingChat,
                chatHistory: updatedHistory,
            };

            const newMap = new Map(prev);
            newMap.set(chatId, updatedChat);
            return newMap;
            });
        } catch (error) {
            console.error('❌ Ошибка обработки сообщения:', error);
        }
    };




    




    const createNewChat = async (userIndex:string)=>{
        
        console.log('Айдишник ', userIndex)

        try {
            const response = await fetch(`${API_MESSAGER}/createNewChat`,{
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ recipientId: userIndex}),
                credentials:'include'
            })

            navigate('/chat')
            
        } catch (error) {
            console.log('Не получилось создать новый чат: ',error)
        }
    }

    const getChatsInfo = async ()=>{
        try{
            const response = await fetch(`${API_MESSAGER}/getChatsInfo`,{
                method:'GET',
                credentials:'include'
            })

            if(!response.ok){
                const errorData = await response.json()
                throw new Error (errorData.message || 'Ошибка запроса контактов')
            }

            const result = await response.json()

            setUserContacts(result)

        }catch(error){
            console.log('Ошибка получения данных о чатах: ', error)
        }
    }




    const sendMessage = (text:string,chatId:string)=>{
        try{
            console.log('Отправка сообщения')
            if(!WS.current){throw new Error('Неккоректный сокет')}
            WS.current.send(

                JSON.stringify({
                    type: 'message:new',
                    chatId,
                    text,
                })
            )

            // setChatsMessages(prev=>{
            //     let newData = new Map(prev)
            //     let messages = newData.get(chatId)?.chatHistory.push()
            //     newData.set(chatId, result[chatId])
            //     return newData
            // })

        }catch(error){
            console.log('Ошибка: ',error)
        }
    }

    const changeCurrentChat = (newChat:userChatInfo)=>{
        setChatSearchParams(prev=>{
            const next = new URLSearchParams(prev);
            next.set('chatId', String(newChat.chat_id));
            return next;
        })
        setCurrentChat({...newChat})
    }



    const getChatData = async (chatId:string)=>{
        try{
            console.log('Запрашиваем данные чатов')
            const params = new URLSearchParams();
            if (currentChatParams.chatId) params.append('chatId', currentChatParams.chatId);

            const response = await fetch(`${API_MESSAGER}/getChatData?${params}`,{
                method: 'GET',
                credentials: 'include',
            });

            if(!response.ok){
                const errorData = await response.json()
                throw new Error(errorData.status || 'Error listings response')
            }

            const result = await response.json();
            console.log('Полученные данные: ',result)
            
            // setChatsMessages(prev=> {return{...prev,[chatId]:result[chatId].chatData}})
            setChatsMessages(prev=>{
                let newData = new Map(prev)
                newData.set(chatId, result[chatId])
                return newData
            })
            console.log('Получены новые данные чатов: ', chatId,'\nИ ',result[chatId])

            console.log('Все данные чатов: ',chatsMessages)
        }catch(error){
            console.log('Ошибка получения данных о чатах: ', error)
        }
    }

    useEffect(()=>{
        if(!currentChat)return
        if(currentChat.chat_id in chatsMessages){
            return
        }else{
            getChatData(currentChat.chat_id)
        }
    },[currentChat])

    useEffect(() => {
        startConnection();
        return () => {
            if (WS.current) {
            WS.current.close();
            WS.current = null;
            }
        };
    }, []);

    return {
        closeConnection,

        createNewChat,
        
        getChatsInfo,
        getChatData,
        
        sendMessage,

        changeCurrentChat,
        
        connectionStatus,
        userContacts,
        currentChat,
        chatsMessages
    }

}