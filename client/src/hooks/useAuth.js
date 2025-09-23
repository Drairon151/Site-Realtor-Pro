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

    const registration = async (event)=>{
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
            let response = await fetch('/api/auth/register',{
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(user)
            })

            if(!response.ok){
                throw new Error(data.message || 'Ошибка регистрации');
            }

            console.log('Обновлённый user:', userData);


        }catch(error){
            setError(error)

        }finally{
            setIsLoading(false)
        }
    }

    const login = async (event)=>{
        setIsLoading(true)

        const formData = new FormData(event.target);
        
        setUser(prev =>({ 
            ...prev,
            mail: formData.get('mail'),
            password: formData.get('password'),
        }))

        try{
            let response = await fetch('/api/auth/login',{
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mail: user.mail,
                    password: user.password
                })
            })

            if(!response.ok){
                throw new Error(data.message || 'Ошибка входа в аккаунт');
            }

        }catch(error){
            setError(error)

        }finally{
            setIsLoading(false)
        }
    }

    return [        
        registration,
        login,
        isLoading,
        error,
    ]
    
}