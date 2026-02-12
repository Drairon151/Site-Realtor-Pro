import { createContext, Dispatch, FormEvent, SetStateAction, useContext } from "react";
import useUser from "../hooks/useUser";
import { User } from "../types/user";

interface UserProviderProps{
    children: React.ReactNode
}

export interface UserContextValue {
    user : User | null,
    setUser: React.Dispatch<React.SetStateAction<User | null>>,
    checkAuth : ()=>{},
    
    cooldownTimer : number,
    setCooldownTimer : Dispatch<SetStateAction<number>>,

    isLoading : boolean,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,

    emailVerificationStatus : {
        status: string,
        type: string,
    },
    
    changePassword : (event: FormEvent<HTMLFormElement>)=>void,
    changePasswordStatus: {
        status: string,
        type:string, 
        message:string
    } | null,
    verifyCodeChangePassword : (event: FormEvent<HTMLFormElement>)=>void,
    sendVerifyCodeChangePassword : ()=>void,
    resendVerifyCodeChangePassword : (event: React.MouseEvent<HTMLButtonElement>)=>void,

    updateUserField : (name: string, value: string)=>void,
    
    userLoading : boolean,
    userAuthorized : boolean,
    setUserAuthorized: React.Dispatch<React.SetStateAction<boolean>>,

    changeUserPhoto : (newPhoto: FileList)=>void,
}

const UserContext = createContext<UserContextValue|undefined>(undefined);

export const UserProvider = ({children}:UserProviderProps)=>{
    const {
        user,
        setUser,
        checkAuth,
        
        cooldownTimer,
        setCooldownTimer,

        isLoading,
        setIsLoading,

        emailVerificationStatus,
        
        changePassword,
        changePasswordStatus,
        verifyCodeChangePassword,
        sendVerifyCodeChangePassword,
        resendVerifyCodeChangePassword,

        updateUserField,
        
        userLoading,
        userAuthorized,
        setUserAuthorized,

        changeUserPhoto,
    } = useUser()

    return(
        <UserContext.Provider value={
            {
                user,
                setUser,
                checkAuth,
                
                cooldownTimer,
                setCooldownTimer,

                isLoading,
                setIsLoading,


                emailVerificationStatus,
                
                changePassword,
                changePasswordStatus,
                verifyCodeChangePassword,
                sendVerifyCodeChangePassword,
                resendVerifyCodeChangePassword,

                updateUserField,
                
                userLoading,
                userAuthorized,
                setUserAuthorized,

                changeUserPhoto,
            }
        }>
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