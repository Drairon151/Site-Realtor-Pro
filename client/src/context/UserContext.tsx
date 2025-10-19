import { createContext, useContext, ReactNode } from "react";
import useUser from "../hooks/useUser";
import { User } from "../types/user";

interface UserProviderProps{
    children: React.ReactNode
}

export interface UserContextValue {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    userLoading: boolean,
    userAuthorized: boolean,
}

const UserContext = createContext<UserContextValue|undefined>(undefined);

export const UserProvider = ({children}:UserProviderProps)=>{
    const {user, userLoading, userAuthorized, setUser} = useUser()

    return(
        <UserContext.Provider value={{user, userLoading, userAuthorized, setUser}}>
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