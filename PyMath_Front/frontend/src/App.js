import logo from './logo.svg';
import React, { Component } from 'react'
import { BrowserRouter  , HashRouter,Switch,Route,Redirect } from 'react-router-dom'
import './App.css';
import Login from './pages/Login/Login';
import Register from './pages/Reg/Reg';
import Admin from './pages/Admin/Admin';


function App() {
  return (
    <BrowserRouter>
        <Switch>
          <Route path='/login' component={Login}/>           
          <Route exact path='/register' component={Register} /> 
          <Route path='/' component={Admin}/> 
        </Switch>
      </BrowserRouter>
  );
}

export default App;
