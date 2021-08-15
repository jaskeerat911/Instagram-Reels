import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Login from './Components/Login/Login';
import SignUp from './Components/SignUp/SignUp';
import Feed from './Components/Feed/Feed';
import Profile from './Components/Profile/Profile';
import AuthProvider, { AuthContext } from './Context/AuthProvider';

function navigator() {
    return (
        <>
            <AuthProvider>
                <Switch>
                    <Route path = "/login" component = {Login}></Route>
                    <Route path = "/signup" component = {SignUp}></Route>
                    <ProtectedRoute path = "/feed" component = {Feed}></ProtectedRoute>
                    <ProtectedRoute path="/profile" component={Profile}></ProtectedRoute>
                    <Redirect path = "/" to = "/feed"></Redirect> 
                </Switch>
            </AuthProvider>
        </>
    )
}

function ProtectedRoute({ component: Component, ...rest }) {
    let { currentUser } = useContext(AuthContext);
    return (
        <Route {...rest} render={(props) => {
            return (currentUser ? <Component {...props}></Component> : <Redirect to = "/login"></Redirect>)
        }}></Route>
    )
}

export default navigator
