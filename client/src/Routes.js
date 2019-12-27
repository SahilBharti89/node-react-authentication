import React from 'react';
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

const Routes = () => (
  // <div>
  //   <Switch>
  //     <Route exact path="/" component={Home} />
  //     <Route exact path="/login" component={Login} />
  //     <Route exact path="/register" component={Register} />
  //     <Route exact path="/reset/:token" component={ResetPassword} />
  //     <Route exact path="/forgotPassword" component={ForgotPassword} />
  //     <Route exact path="/userProfile/:username" component={Profile} />
  //     <Route exact path="/updateUser/:username" component={UpdateProfile} />
  //     <Route
  //       exact
  //       path="/updatePassword/:username"
  //       component={UpdatePassword}
  //     />
  //   </Switch>
  // </div>
  // );
      <BrowserRouter>
        <Switch>
          <PublicRoute exact path="/" restricted={false} component={Home} />
          <PublicRoute exact path="/register" restricted={false} component={Register} />
          <PublicRoute exact path="/login" restricted={true} component={Login} />
          <PrivateRoute exact path="/reset/:token" component={ResetPassword} />
          <PrivateRoute exact path="/forgotPassword" component={ForgotPassword} />
          <PrivateRoute exact path="/userProfile/:username" component={Profile} />
          <PrivateRoute exact path="/updateUser/:username" component={UpdateProfile} />
        </Switch>
      </BrowserRouter>
  );


export {Routes};
