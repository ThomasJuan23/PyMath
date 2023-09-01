//操作local数据的工具函数模块
const USER_KEY = 'user_key';
const QUESTION_KEY = 'question_key';
const MESSAGE_KEY = 'message_key';
const Thread_KEY = 'thread_key';


export default {
    saveUser(user){
        localStorage.setItem(USER_KEY, JSON.stringify(user))
    },
    getUser(){
        return JSON.parse(localStorage.getItem(USER_KEY)) || {};//返回user对象或空

    },
    removeUser(){
        localStorage.removeItem(USER_KEY);
    },
    saveQuestion(question){
        localStorage.setItem(QUESTION_KEY,JSON.stringify(question))
    },
    getQuestion(){
        return JSON.parse(localStorage.getItem(QUESTION_KEY)) || {};//返回user对象或空
    },
    removeQuestion(){
        localStorage.removeItem(QUESTION_KEY);
    },  
    saveMessage(message){
        localStorage.setItem(MESSAGE_KEY,JSON.stringify(message))
    },
    getMessage(){
        return JSON.parse(localStorage.getItem(MESSAGE_KEY)) || {};//返回user对象或空
    },
    removeMessage(){
        localStorage.removeItem(MESSAGE_KEY);
    },  
    saveThread(message){
        localStorage.setItem(Thread_KEY,JSON.stringify(message))
    },
    getThread(){
        return JSON.parse(localStorage.getItem(Thread_KEY)) || {};//返回user对象或空
    },
    removeThread(){
        localStorage.removeItem(Thread_KEY);
    }, 
    
}