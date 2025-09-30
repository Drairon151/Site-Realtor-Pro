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
    const [cooldownTimer, setCooldownTimer] = useState(0)


    const API_AUTH = 'http://localhost:5000/api/auth';

    useEffect(() => {
        if (cooldownTimer > 0) {
        const timerId = setTimeout(() => {
            console.log('timer ', cooldownTimer)
            setCooldownTimer(cooldownTimer - 1);
        }, 1000);

        return () => clearTimeout(timerId); // Очистка при размонтировании или изменении
        }
    }, [cooldownTimer]); 

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

            setUser(result.user);

        } catch (err) {
            setError(true)
        }finally{
            setIsLoading(false)
        }
        };

        checkAuth();
    }, []);

    const registration = async (event)=>{
        event.preventDefault()
        setError(false);
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

            const result = await response.json();

            setUser({...user, _id: result._id})
            setEmailAuthStatus({status:'wait-email-conf', type:'wait'})
            }catch(error){
                setError(true)

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


            if(!response.ok){
                throw new Error(response.message || 'Ошибка входа в аккаунт');
            }

            const result = await response.json()

            window.location.href = '/';
            

            setUser({...user, ...result.user})
        }catch(error){

            setError(true)

        }finally{
            setIsLoading(false)
        }
    }

    const verifyEmail = async(event)=>{
        event.preventDefault()
        setError(false);
        setIsLoading(true)

        const formData = new FormData(event.target);
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
            setError(true);

        }finally{
            setIsLoading(false)
        }

    }

    const resendVerification = async ()=>{

        setIsLoading(true)
        try{

            const response = await fetch(`${API_AUTH}/resend-verification`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({_id: user._id}),
                credentials: 'include',
            });

            if(!response.ok){
                throw new Error(response.message || 'Ошибка переотправки кода')
            }

            const result = await response.json()
            console.log(result.cooldown)
            setCooldownTimer(result.cooldown);

        }catch(error){
            setError(true)
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
        
        cooldownTimer,
        isLoading,
        error,
        emailAuthStatus,
        user,
    }
    
}