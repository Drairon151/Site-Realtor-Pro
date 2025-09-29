import { useState, useEffect } from "react";

export default function useAuth(){

    const [user, setUser] = useState({
        _id : null,
        role: null,
        userName: null,
        mail: null,
        numberPhone: null,
    })
    const [emailAuthStatus, setEmailAuthStatus] = useState({
        status:'not-sent',
        type:null,
    });
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(false)



    const API_AUTH = 'http://localhost:5000/api/auth';



    useEffect(() => {
        const checkAuth = async () => {
        try {
            setIsLoading(true)
            const response = await fetch('http://localhost:5000/api/me', {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(response.message || 'Ошибка проверки авторизации')
            }

            const result = await response.json();
            console.log('Результат в проверка авторизации: ',result.user)
            setUser(result.user);

        } catch (err) {
            setUser(null);
        }finally{
            setIsLoading(false)
        }
        };

        checkAuth();
    }, []);

    const registration = async (event)=>{
        event.preventDefault()
        setError(null);
        setIsLoading(true)

        const formData = new FormData(event.target);

        const userData = {
            userName: formData.get('userName'),
            mail: formData.get('mail'),
            numberPhone: formData.get('numberPhone'),
            password: formData.get('password'),
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
            setEmailAuthStatus({status:'wait-email-conf', type:'wait'})
            }catch(error){
                setError(error.message)

            }finally{
                setIsLoading(false)
            }
    }

    const login = async (event)=>{
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.target);
        
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
            console.log('отладка шоколадка')

            if(!response.ok){
                throw new Error(response.message || 'Ошибка входа в аккаунт');
            }

            const result = await response.json()

            window.location.href = '/';
            
            setUser(result.user)
        }catch(error){

            setError(error)

        }finally{
            setIsLoading(false)
        }
    }

    const verifyEmail = async(event)=>{
        event.preventDefault()
        setError(null);
        setIsLoading(true)

        const formData = new FormData(event.target);
        console.log('Айди пользователя ',currentUser._id )
        const userData = {
            userId: currentUser._id,
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

            if(!response.ok){
                const errorType = await response.json().type;
                
                if(errorType==='code-expired'){
                    setEmailAuthStatus({status:'error', type: 'code-expired'})
                }else if(errorType==='invalid_code'){
                    setEmailAuthStatus({status:'error', type: 'invalid_code'})
                }

                throw new Error(response.message || 'Ошибка отправки кода подтверждения на сервер')
            }

            setEmailAuthStatus({status:'success', type: 'verified'})
            window.location.href = '/';
        }catch(error){            
            setError(error);

        }finally{
            setIsLoading(false)
        }

    }

    const resendVerification = async ()=>{
        console.log('Пересоздание кода')
        setIsLoading(true)
        try{
            const response = await fetch(`${API_AUTH}/resend-verification`, {
            method: 'POST',
            credentials: 'include', // ← кука с токеном пришлётся
            });

            if(!response.ok){
                throw new Error(response.message || 'Ошибка выхода из аккаунта')
            }

        }catch(error){
            setError(error)
        }finally{
            setIsLoading(true)
        }

    }

    const logout = async ()=>{
        setIsLoading(true)
        try{
            const response = await fetch(`${API_AUTH}/logout`,{
                method:'POST',
                credentials: 'include',
            });

            if(!response.ok){
                throw new Error(response.message || 'Ошибка выхода из аккаунта')
            }

            window.location.href = '/';

        }catch(error){
            setError(error)
        }finally{
            setIsLoading(true)
        }

    }

    return {        
        registration,
        login,
        verifyEmail,
        resendVerification,
        logout,

        isLoading,
        error,
        emailAuthStatus,
        user,
    }
    
}