//Utility module for handling local data
const USER_KEY = 'user_key';
const QUESTION_KEY = 'question_key';
const MESSAGE_KEY = 'message_key';
const Thread_KEY = 'thread_key';


export default {
    saveUser(user){
        localStorage.setItem(USER_KEY, JSON.stringify(user))
    },
    getUser(){
        return JSON.parse(localStorage.getItem(USER_KEY)) || {};//return user object

    },
    removeUser(){
        localStorage.removeItem(USER_KEY);
    },
    saveQuestion(question){
        localStorage.setItem(QUESTION_KEY,JSON.stringify(question))
    },
    getQuestion(){
        return JSON.parse(localStorage.getItem(QUESTION_KEY)) || {};//return question object
    },
    removeQuestion(){
        localStorage.removeItem(QUESTION_KEY);
    },  
    saveMessage(message){
        localStorage.setItem(MESSAGE_KEY,JSON.stringify(message))
    },
    getMessage(){
        return JSON.parse(localStorage.getItem(MESSAGE_KEY)) || {};//return message object
    },
    removeMessage(){
        localStorage.removeItem(MESSAGE_KEY);
    },  
    saveThread(message){
        localStorage.setItem(Thread_KEY,JSON.stringify(message))
    },
    getThread(){
        return JSON.parse(localStorage.getItem(Thread_KEY)) || {};//return thread object
    },
    removeThread(){
        localStorage.removeItem(Thread_KEY);
    }, 
    
}