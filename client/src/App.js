import React, { Component } from 'react';
import { Switch, BrowserRouter } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

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


class App extends Component {
    render() {
      return(
        <BrowserRouter>
          <Switch>
            <PublicRoute exact path="/" restricted={false} component={Home} />
            <PublicRoute  path="/register" restricted={false} component={Register} />
            <PublicRoute  path="/forgotPassword" restricted={false} component={ForgotPassword} />
            <PublicRoute path="/reset/:token" restricted={false} component={ResetPassword} />
            <PublicRoute  path="/login" restricted={true} component={Login} />
            <PrivateRoute path="/userProfile/:username" component={Profile} />
            <PrivateRoute path="/updateUser/:username" component={UpdateProfile} />
            <PrivateRoute path="/updatePassword/:username" component={UpdatePassword} />
          </Switch>
        </BrowserRouter>
      )
    }
  
  };
  export default App;


