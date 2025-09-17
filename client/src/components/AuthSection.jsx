import Button from "./Button/Button";

export default function AuthSection(){
    return(
        <div className="flex center">
            <Button>Регистрация</Button>
            <Button>Вход</Button>
        </div>
    )
}