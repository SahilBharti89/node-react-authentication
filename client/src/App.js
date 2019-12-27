import React, { Component } from 'react';
import './App.css';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import Home from './containers/Home';
import Register from './containers/Register';
import Login from './containers/Login';
import Profile from './containers/Profile';
import UpdateProfile from './containers/UpdateProfile';
import ForgotPassword from './containers/ForgotPassword';
import ResetPassword from './containers/ResetPassword';
import UpdatePassword from './containers/UpdatePassword';
import PrivateRoute from './helper/PrivateRoute';
import PublicRoute from './helper/PublicRoute';
import {Routes} from './Routes';

class App extends Component {
    render() {
      return(
        <div>
        {/* <BrowserRouter> */}
            <Switch>
              <PublicRoute exact path="/" restricted={false} component={Home} />
              <PublicRoute  path="/register" restricted={false} component={Register} />
              <PublicRoute  path="/login" restricted={true} component={Login} />
              <PrivateRoute  path="/reset/:token" component={ResetPassword} />
              <PrivateRoute  path="/forgotPassword" component={ForgotPassword} />
              <PrivateRoute  path="/userProfile/:username" component={Profile} />
              <PrivateRoute  path="/updateUser/:username" component={UpdateProfile} />
            </Switch>
          {/* </BrowserRouter> */}
          </div>
      )
    }
  
  };
  export default App;


