import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isLogin }  from '../utils';

const PublicRoute = ({ component: Component, restricted, ...rest}) => {
    return (
        // restricted = false meaning public route
        // restricted = true meaning restricted route
        //     localStorage.getItem('user') === null ? 
        // <Component {...props} /> : 
        // <Redirect to={{ pathname: "/userProfile/:username", state: { from: props.location }}}/>
        <Route {...rest} render={props =>(
            isLogin() && restricted ?
            <Redirect to="/userProfile/:username" /> : 
            <Component {...props} />
        )} />
    );
};
export default PublicRoute;
