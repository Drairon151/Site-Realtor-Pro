import { useState, useEffect } from "react";

export default function useAuth(){

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
    const [emailAuthStatus, setEmailAuthStatus] = useState({
        status:null,
        type:null,
    });
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(false)
    const [userAuthorized, setUserAuthorized] = useState(false)
    const [cooldownTimer, setCooldownTimer] = useState(0)


    const API_AUTH = 'http://localhost:5000/api/auth';

    useEffect(() => {
        if (cooldownTimer > 0) {
        const timerId = setTimeout(() => {
            setCooldownTimer(cooldownTimer - 1);
        }, 1000);

        return () => clearTimeout(timerId); // Очистка при размонтировании или изменении
        }
    }, [cooldownTimer]); 


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
                setUserAuthorized(false)
                setError(true)
            }finally{
                setIsLoading(false)
            }
        };

        checkAuth()
    
    },[])

    const registration = async (event)=>{
        event.preventDefault()
        setError(false);
        setIsLoading(true)

        const formData = new FormData(event.target);

        const userData = {

            surname: formData.get('surname'),
            name: formData.get('name'),
            patronymic: formData.get('patronymic'),

            mail: formData.get('mail'),
            numberPhone: formData.get('numberPhone'),
            password: formData.get('password'),
            role: formData.get('role'),
        };

        console.log('Данные пользователя: ', userData)

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
            
            setUser({...userData, _id: result._id})
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
            
            localStorage.setItem('userData',JSON.stringify({...user, ...result.user}))
            setUserAuthorized(true)
            setUser({...userData, ...result.user})
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
            const result = await response.json()


            if(!response.ok){
                
                console.log('ААА ШИБКА', result)

                setEmailAuthStatus({...emailAuthStatus, type: result.type})


                throw new Error(response.message || 'Ошибка отправки кода подтверждения на сервер')
            }
            
            setEmailAuthStatus({status:null, type:null,})
            localStorage.setItem('userData',JSON.stringify(user))

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

            localStorage.removeItem('userData')
            setUser({
                name: null,
                surname: null,
                patronymic: null,

                _id : null,
                role: null,

                mail: null,
                numberPhone: null,
                isDiplomaVerified: false,
            })
            setEmailAuthStatus({
                status:null,
                type:null,
            })
            setUserAuthorized(false)
            window.location.href = '/';
        }catch(error){
            setError(true)
        }finally{
            setIsLoading(false)
        }

    }

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
            window.location.href = '/ProfilePage';

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

    const resendVerifyCodeChangePassword = async()=>{
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

    return {        
        registration,
        login,
        verifyEmail,
        resendVerification,
        
        logout,

        changePassword,
        verifyCodeChangePassword,
        sendVerifyCodeChangePassword,
        resendVerifyCodeChangePassword,

        cooldownTimer,
        isLoading,
        error,
        emailAuthStatus,
        user,
        userAuthorized,
    }
    
}