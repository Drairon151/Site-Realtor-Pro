import { createContext, useContext, ReactNode } from "react";
import useUser from "../hooks/useUser";
import { User } from "../types/user";

interface UserProviderProps{
    children: React.ReactNode
}

type UserContextType = ReturnType<typeof useUser>

const UserContext = createContext<UserContextType|undefined>(undefined);

export const UserProvider = ({children}:UserProviderProps)=>{
    const userState = useUser()

    return(
        <UserContext.Provider value={userState}>
            {children}
        </UserContext.Provider>
    )
}

export const useUserContext = ( ) => {
    const context = useContext(UserContext)
    if(!context){
        throw new Error('ВНЕ ПРОВАЙДЕРА')
    }
    return context
}