import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from 'react-router-dom';
import {User} from '../types/user'

export default function useUser(){
    const navigate = useNavigate()

    interface MeResponse {
        user: User;
    }

    interface EmailVerificationStatus{
        status: string,
        type: string,
    }

    interface ResultUpdateUserField{
        status: string,
        updatedField: keyof User,
        updatedValue: string,
    }

    const [user, setUser] = useState<User | null>(null)

    const [emailVerificationStatus, setEmailVerificationStatus] = useState<EmailVerificationStatus>({
        status:'code-not-success',
        type:'',
    });


    const API_USER: string = 'http://localhost:5000/api/user';
    const [cooldownTimer, setCooldownTimer] = useState<number>(0);
    const [userAuthorized, setUserAuthorized] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [userLoading, setUserLoading] = useState<boolean>(false);
    
    useEffect(()=>{
        const checkAuth = async () => {
            setUserLoading(true)

            console.log('Проверка авторизации')
            try {

                const response = await fetch('http://localhost:5000/api/me', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {

                    try{
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Ошибка проверки авторизации')
                    }catch{
                        throw new Error(`HTTP ${response.status} ${response.statusText}`)

                    }

                }

                const result = await response.json() as MeResponse;
                setUserAuthorized(true)
                setUser(result.user);
                console.log('Данные успешно получены',result.user)
            }catch(error){
                if (error instanceof Error) {
                    console.log(error.message);
                    setUserAuthorized(false)
                } else {
                    console.log('Ошибка:', error);
                }
            }finally{
                setUserLoading(false)

            }
        };

        checkAuth()
    
    },[])
    
    const verifyCodeChangePassword = async(event: FormEvent<HTMLFormElement>) =>{
        event.preventDefault()
        
        setIsLoading(true)

        const formData = new FormData(event.currentTarget);

        try{

            if(!user){
                throw new Error('Пользователь не авторизован')   
            }

            const userData = {
                _id: user._id,
                code: formData.get('emailCode'),
            };

            const response = await fetch(`${API_USER}/change-password`,{
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
                credentials: 'include',
            })
            
            if (!response.ok) {

                try{
                    const errorData = await response.json();
                    setEmailVerificationStatus({
                        status: errorData.status,
                        type: errorData.type,
                    })
                    throw new Error(errorData.message || 'Ошибка отправки кода подтверждения на сервер')
                }catch{
                    throw new Error(`HTTP ${response.status} ${response.statusText}`)

                }

            }

            setEmailVerificationStatus({status: 'code-success' , type: 'success'})
        }catch(error){
            if (error instanceof Error) {
                console.log(error.message);
            } else {
                console.log('Ошибка:', error);
            }
        }finally{
            
            setIsLoading(false)
        }
    }

    const changePassword = async(event: FormEvent<HTMLFormElement>)=>{
        event.preventDefault()

        setIsLoading(true)
        const formData = new FormData(event.currentTarget);
        if(!user){
            throw new Error('Пользователь не авторизован')   
        }

        const userData = {
            _id: user._id,
            oldPassword: formData.get('oldPassword'),
            newPassword: formData.get('newPassword'), 
        }
        console.log(userData)
        try{
            const response = await fetch(`${API_USER}/change-password`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
                credentials: 'include',
            });

                if (!response.ok) {

                    try{
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Ошибка смены пароля')
                    }catch{
                        throw new Error(`HTTP ${response.status} ${response.statusText}`)

                    }

                }
            navigate('/ProfilePage', { replace: true });

        }catch(error){
            if (error instanceof Error) {
                console.log(error.message);
            } else {
                console.log('Ошибка:', error);
            }
        }finally{
            setIsLoading(false)
        }

    }

    const sendVerifyCodeChangePassword = async ()=>{
        setIsLoading(true)
        try{
            if(!user){
                throw new Error('Пользователь не авторизован')   
            }

            const response = await fetch(`${API_USER}/send-password-reset-code`, {
                method: 'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({ _id: user._id }),
                credentials: 'include',
            });
            if (!response.ok) {

                try{
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Ошибка запроса на отправление кода подтверждения')
                }catch{
                    throw new Error(`HTTP ${response.status} ${response.statusText}`)

                }

            }
            setEmailVerificationStatus({
                status: 'code-not-success',
                type: 'wait',
            })
        }catch(error){
            if (error instanceof Error) {
                console.log(error.message);
            } else {
                console.log('Ошибка:', error);
            }
        }
    }

    const resendVerifyCodeChangePassword = async(event: FormEvent<HTMLFormElement>)=>{
        setIsLoading(true)
        event.preventDefault()

        setIsLoading(true)
        if(!user){
            throw new Error('Пользователь не авторизован')   
        }

        const userData = {
            _id: user._id
        };

        console.log(userData)

        try{
            const response = await fetch(`${API_USER}/resend-password-reset-code`,{
                method: 'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(userData),
                credentials: 'include',
            })

            if (!response.ok) {

                try{
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Ошибка подтверждения кода')
                }catch{
                    throw new Error(`HTTP ${response.status} ${response.statusText}`)

                }

            }
            
            const result = await response.json()
            console.log(result.cooldown)
            setCooldownTimer(result.cooldown);
        }catch(error){
            if (error instanceof Error) {
                console.log(error.message);
            } else {
                console.log('Ошибка:', error);
            }
        }finally{
            setIsLoading(false)
        }

    };

    const updateUserField = async (name:string, value:string)=>{

        try{
            
            const response = await fetch(`${API_USER}/update-user-field`,{
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    updatedField: name,
                    updatedValue: value,
                }),
                credentials: 'include',
            })

            if (!response.ok) {

                try{
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Ошибка запроса на изменение данных')
                }catch{
                    throw new Error(`HTTP ${response.status} ${response.statusText}`)

                }

            }

            const result:ResultUpdateUserField = await response.json()
            
            setUser(prev => {
                if (!prev) return null;

                return {
                    ...prev,
                    [result.updatedField]: result.updatedValue,
                } as User;
            });

            }catch(error){
                if (error instanceof Error) {
                    console.log(error.message);
                } else {
                console.log('Ошибка:', error);
                }
            }
        }


    return {
        user,
        setUser,
        
        cooldownTimer,
        setCooldownTimer,

        isLoading, 
        setIsLoading,

        emailVerificationStatus,
        
        changePassword,
        verifyCodeChangePassword,
        sendVerifyCodeChangePassword,
        resendVerifyCodeChangePassword,

        updateUserField,
        
        userLoading,
        userAuthorized, 
        setUserAuthorized,
    }
}