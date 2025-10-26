import {inputValideResult} from '../types/inputValidResult';

export default function baseInputValidator(inputValue: string):inputValideResult{
    if(!inputValue || inputValue == ''){
        return{validStatus:'input is empty', validMessage:'Поле обязательно к заполнению'}
    }
    return {validStatus:'input succes', validMessage:'Поле корректно'}
}