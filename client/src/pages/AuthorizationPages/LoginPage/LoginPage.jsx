import Login from "../../../components/Authorization/Login/Login";
import useAuth from "../../../hooks/useAuth";

export default function LoginPage(){
    const {
        login,
    } = useAuth()

    return(
        <div className="login-page auth-pages">

            <Login
                login={login}
                onClose={()=>console.log('plug')}
            />
        
        </div>
    )
}