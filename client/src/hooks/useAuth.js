import { useState, useEffect } from "react";

export default function useAuth(){

    const [user, setUser] = useState({
        userName: null,
        mail: null,
        numberPhone: null,
        password: null,
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(false)
    const API_AUTH = 'http://localhost:5000/api/auth';

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
        try {
            setIsLoading(true)
            const response = await fetch('http://localhost:5000/api/me', {
            method: 'GET',
            credentials: 'include',
            });

            if (!response.ok) {
            setCurrentUser(null);
            return;
            }

            const data = await response.json();
            setCurrentUser(data.user);
            setUser(prev => ({ ...prev, ...data.user }));

        } catch (err) {
            console.error('Ошибка проверки авторизации:', err);
            setCurrentUser(null);
        }finally{
            setIsLoading(false)
            console.log('Файнали выполнился')
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
        
        setUser(prev => ({ ...prev, ...userData }));

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
            setCurrentUser(result.user);
            setUser(prev => ({ ...prev, mail: result.user.mail }));

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

        setUser(prev =>({ 
            ...prev,
            ...userData
        }))

        try{
            let response = await fetch(`${API_AUTH}/login`,{
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
                throw new Error(data.message || 'Ошибка входа в аккаунт');
            }
            
            setUser(data.user)
        }catch(error){
            setError(error)

        }finally{
            setIsLoading(false)
        }
    }

    const logout = async ()=>{
        fetch(`${API_AUTH}/logout`)
    }

    return {        
        registration,
        login,
        logout,

        isLoading,
        error,
        currentUser,
    }
    
}