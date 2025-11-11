import { useNavigate } from 'react-router-dom';

import { useState, useEffect, FormEvent  } from "react";
import { useUserContext } from '../context/UserContext';
import {User} from "../types/user"
import useUser from './useUser';

export default function useAuth(){
    interface EmailAuthStatus{
        status: string | null,
        type: string | null,
    }

    const {
        user,
        setUser,
    } = useUserContext();

    const {
        cooldownTimer,
        setIsLoading,
        setCooldownTimer,
        setUserAuthorized,
    } = useUser()
    const [emailAuthStatus, setEmailAuthStatus] = useState<EmailAuthStatus>({
        status:'',
        type:'',
    });

    const [error, setError] = useState<boolean>(false)

    const API_AUTH:string = 'http://localhost:5000/api/auth';

    const navigate = useNavigate();

    useEffect(() => {
        if (cooldownTimer > 0) {
        const timerId = setTimeout(() => {
            setCooldownTimer(cooldownTimer - 1);
        }, 1000);

        return () => clearTimeout(timerId);
        }
    }, [cooldownTimer]); 

    const registration = async (event: FormEvent<HTMLFormElement>)=>{
        event.preventDefault()
        setError(false);
        setIsLoading(true)

        const formData = new FormData(event.currentTarget);

        const userData = {
            surname: formData.get('surname'),
            name: formData.get('name'),
            patronymic: formData.get('patronymic'),

            mail: formData.get('mail'),
            numberPhone: formData.get('numberPhone'),
            password: formData.get('password'),
            role: formData.get('role'),
            isDiplomaVerified: false,

        };


        try{
            const response = await fetch(`${API_AUTH}/register`,{
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
                credentials: 'include',
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Ошибка регистрации');
            }

            const result = await response.json();

            setUser({
                ...userData,
                _id: result._id,
            }as User)
            setEmailAuthStatus({status:'wait-email-conf', type:'wait'})
            }catch(error){
                setError(true)

            }finally{
                setIsLoading(false)
            }
    }

    const login = async (event: FormEvent<HTMLFormElement>)=>{
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget);
        
        const userData = {
            mail: formData.get('mail'),
            password: formData.get('password'),
        };

        try{
            const response = await fetch(`${API_AUTH}/login`,{
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mail: userData.mail,
                    password: userData.password
                }),
                credentials: 'include',
            })


                if (!response.ok) {

                    try{
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Ошибка входа в аккаунт')
                    }catch{
                        throw new Error(`HTTP ${response.status} ${response.statusText}`)

                    }

                }

            const result = await response.json()
            navigate('/profile', { replace: true });
            
            setUserAuthorized(true)
            setUser({...userData, ...result.user})
        }catch(error){

            setError(true)

        }finally{
            setIsLoading(false)
        }
    }

    const verifyEmail = async(event: FormEvent<HTMLFormElement>)=>{
        event.preventDefault()
        setError(false);
        setIsLoading(true)
        if(!user){
            throw new Error('Пользователь не авторизован')   
        }

        const formData = new FormData(event.currentTarget);
        const userData = {
            _id: user._id,
            code: formData.get('emailCode'),
        };

        try{
            const response = await fetch(`${API_AUTH}/verify-email`,{
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
                credentials: 'include',
            })
            const result = await response.json()


            if(!response.ok){
                

                setEmailAuthStatus({...emailAuthStatus, type: result.type})

                try{
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Ошибка проверки кода')
                }catch{
                    throw new Error(`HTTP ${response.status} ${response.statusText}`)

                }

            }
            
            setEmailAuthStatus({status:'', type:'',})

            navigate('/', { replace: true });


        }catch(error){            
            setError(true);

        }finally{
            setIsLoading(false)
        }

    }


    const resendVerification = async ()=>{

        setIsLoading(true)
        if(!user){
            throw new Error('Пользователь не авторизован')   
        }
        try{

            const response = await fetch(`${API_AUTH}/resend-verification`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({_id: user._id}),
                credentials: 'include',
            });

                if (!response.ok) {

                    try{
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Ошибка повторной отправки кода')
                    }catch{
                        throw new Error(`HTTP ${response.status} ${response.statusText}`)

                    }

                }

            const result = await response.json()
            setCooldownTimer(result.cooldown);

        }catch(error){
            setError(true)
        }finally{
            setIsLoading(false)
        }

    }

    const logout = async ()=>{
        setIsLoading(true)
        try{
            const response = await fetch(`${API_AUTH}/logout`,{
                method:'POST',
                credentials: 'include',
            });

                if (!response.ok) {

                    try{
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Ошибка выхода из аккаунта')
                    }catch{
                        throw new Error(`HTTP ${response.status} ${response.statusText}`)

                    }

                }

            setUser(null)
            setEmailAuthStatus({
                status:'',
                type:'',
            })
            setUserAuthorized(false)
            navigate('/', { replace: true });
        }catch(error){
            setError(true)
        }finally{
            setIsLoading(false)
        }

    }


    return {        
        registration,
        login,
        verifyEmail,
        resendVerification,
        
        logout,

        error,
        emailAuthStatus,
    }
    
}