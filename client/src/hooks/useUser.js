import { useState, useEffect } from "react";

export default function useUser(){
    const [user, setUser] = useState({
        name: null,
        surname: null,
        patronymic: null,

        _id : null,
        role: null,

        mail: null,
        numberPhone: null,
        isDiplomaVerified: false,
    })

    const API_USER = 'http://localhost:5000/api/user';
    const [cooldownTimer, setCooldownTimer] = useState(0)
    const [userAuthorized, setUserAuthorized] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    
    useEffect(()=>{
        const checkAuth = async () => {
            console.log('Проверка авторизации')
            try {

                const response = await fetch('http://localhost:5000/api/me', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error(response.message || 'Ошибка проверки авторизации')
                }

                const result = await response.json();
                setUserAuthorized(true)
                localStorage.setItem('userData',JSON.stringify(result.user))
                setUser(result.user);

            } catch (err) {
                console.log('Ошибка авторизации')
                setUserAuthorized(false)
                setError(true)
            }finally{
                setIsLoading(false)

            }
        };

        checkAuth()
    
    },[])
    
    const verifyCodeChangePassword = async(event)=>{
        event.preventDefault()
        setError(false);
        setIsLoading(true)

        const formData = new FormData(event.target);
        const userData = {
            _id: user._id,
            code: formData.get('emailCode'),
        };

        try{
            const response = await fetch(`${API_AUTH}/change-password`,{
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
                credentials: 'include',
            })

            const result = await response.json();


            if(!response.ok){
                setEmailAuthStatus({...emailAuthStatus, type: result.type} )

                throw new Error(response.message || 'Ошибка отправки кода подтверждения на сервер')
            }

            setEmailAuthStatus({status: 'code-success' , type: 'success'})
            localStorage.setItem('userData',JSON.stringify(user))
        }catch(error){



            setError(true);

        }finally{
            
            setIsLoading(false)
        }
    }

    const changePassword = async(event)=>{
        event.preventDefault()

        setIsLoading(true)
        const formData = new FormData(event.target);
        const userData = {
            _id: user._id,
            oldPassword: formData.get('oldPassword'),
            newPassword: formData.get('newPassword'), 
        }
        console.log(userData)
        try{
            const response = await fetch(`${API_AUTH}/change-password`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
                credentials: 'include',
            });

            if(!response.ok){
                throw new Error(response.message || 'Ошибка смены пароля')

            }
            navigate('/ProfilePage', { replace: true });

        }catch(error){
            setError(true)

        }finally{
            setIsLoading(false)
        }

    }

    const sendVerifyCodeChangePassword = async ()=>{
        setIsLoading(true)
        try{

            const response = await fetch(`${API_AUTH}/send-password-reset-code`, {
                method: 'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({ _id: user._id }),
                credentials: 'include',
            });
            if(!response.ok){
                throw new Error(response.message || 'Ошибка запроса на отправку кода подтверждения')
            }
            setEmailAuthStatus({
                status: 'code-not-success',
                type: 'wait',
            })
        }catch(error){
            console.log(error.message)
        }
    }

    const resendVerifyCodeChangePassword = async(event)=>{
        setIsLoading(true)
        event.preventDefault()

        setIsLoading(true)
        setError(false);

        const userData = {
            _id: user._id
        };

        console.log(userData)

        try{
            const response = await fetch(`${API_AUTH}/resend-password-reset-code`,{
                method: 'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(userData),
                credentials: 'include',
            })

            if(!response.ok){
                throw new Error(response.message || 'Ошибка подтверждения кода')
            }
            
            const result = await response.json()
            console.log(result.cooldown)
            setCooldownTimer(result.cooldown);
        }catch(error){
            console.log(error.message)
        }finally{
            setIsLoading(false)
        }

    };

    const updateUserField = async (name, value)=>{
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

            if(!response.ok){
                throw new Error(response.message || 'Ошибка запроса на изменение данных')
            }

            const result = await response.json()
            
            setUser(prev=>{
                prev[result.updatedField] = result.updatedValue;
                return{...prev}
            })
        }catch(error){
            console.log(error.message)
        }
    }


    return {
        user,
        setUser,
        
        cooldownTimer,
        setCooldownTimer,

        isLoading, 
        setIsLoading,
        
        changePassword,
        verifyCodeChangePassword,
        sendVerifyCodeChangePassword,
        resendVerifyCodeChangePassword,

        updateUserField,

        userAuthorized, 
        setUserAuthorized,
    }
}