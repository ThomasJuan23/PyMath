import logo from './logo.svg';
import React, { Component } from 'react'
import { BrowserRouter, HashRouter, Switch, Route, Redirect } from 'react-router-dom'
import './App.css';
import Login from './pages/Login/Login';
import Register from './pages/Reg/Reg';
import User from './pages/UserAdmin/Admin'
import Teacher from './pages/TeacherAdmin/Admin'
import AdminHome from './pages/Admin/Admin'
import Home from './pages/Home/home';
import Reset from './pages/ResestPassword/Reg'

import ReactLive2d from 'react-live2d'

const encouragementMessages = [
  "Keep going, every effort you make brings you one step closer to your goals!",
  "Don't worry if you make mistakes, they're the building blocks to success!",
  "Math is the language of the universe, and  Python is a language of the futur. You're learning some powerful tools!",
  "Remember, the more you practice, the better you get. Keep it up!",
  "Every great mathematician and programmer started out not knowing anything, just like you. You're on the path to becoming great!",
  "Every problem you solve makes the next one easier. You're getting stronger with every challenge!",
  "Remember, learning is a journey, not a destination. Enjoy each step along the way!",
  "Coding isn't just typing on a keyboard, it's telling a story. What will your story be?",
  "The beauty of math is that there's always a clear answer. The beauty of coding is that there are many ways to find it!",
  "You're doing a great job! Remember, it's not about how fast you go, but how far you come. Keep learning!",
  "Your hard work is paying off! Every line of code you write, every problem you solve, brings you closer to your dreams!",
  "Believe in yourself! You have the power to create, to solve, to learn. You're doing amazing!",
  "Remember, there's no limit to what you can achieve. Keep pushing your boundaries and you'll be amazed at what you can do!"
];

const encouragementMessages2 = [
  "Keep going!",
  "Math is the language of the universe",
  "Python is a language of the future",
  "You're doing great!",
  "Believe in yourself!",
  "Never stop learning!",
  "You're making progress!",
  "Stay curious!",
  "Don't give up!",
  "You can do it!",
  "Practice makes perfect!",
  "Challenge your limits!"
];


function App() {
  return (
    <div>
      <ReactLive2d
        width={250}
        height={400}
        ModelList={['Mark']}
        color="#C8E6FE"
        TouchDefault={encouragementMessages2}
        menuList={[]}
      />
      <BrowserRouter>
        <Switch>
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register} />
          <Route path='/useradmin' component={User}></Route>
          <Route path='/teacheradmin' component={Teacher}></Route>
          <Route path='/admin' component={AdminHome}></Route>
          <Route path='/reset' component={Reset}></Route>
          <Route path='/' component={Home} />
        </Switch>
      </BrowserRouter>

    </div>
  );
}

export default App;
