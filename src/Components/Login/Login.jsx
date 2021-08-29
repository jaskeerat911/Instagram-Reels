import './Login.css';
import logo from './Instagram-Logo.png';
import React, { useState, useContext, useEffect } from 'react'
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthProvider'
import Loader from '../Loader/Loader';
import Error from '../Error/Error';

function Login(props) {
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [loginLoader, setLoginLoader] = useState(false);
    let [error, setError] = useState("");

    let { genericlogin, currentUser } = useContext(AuthContext);

    const loginFn = async () => {
        try {
            setLoginLoader(true);
            await genericlogin(email, password);
            setLoginLoader(false);
        }
        catch(err) {
            setLoginLoader(false);
            setError("Invalid Email or Passoword");
            setEmail("");
            setPassword("");
            setTimeout(() => {
                setError(false);
            }, 2000);
        }
    }

    const focusListener = (e) => {
        if (e.target.value) {
            e.target.parentElement.classList.add('focus');
        }
        else {
            e.target.parentElement.classList.remove('focus');
        }
    }

    useEffect(() => {
        if (currentUser) {
            props.history.push('/feed')
        }
        return;
    })
 
    return (
        loginLoader ? <Loader></Loader> :
            currentUser ? <></> :
                    <div className="login-container">
                        <div className="input-container">
                            <div className="logo-container">
                                <img src={logo} alt="Instagram" />
                            </div>
                            <div className="input-field-container">
                                <div className = "input-field">
                                    <span>Email</span>
                                    <input className = "login-input" type="email" value={email}
                                        onChange={function (e) {
                                            setEmail(e.target.value)
                                        }}
                                        onKeyUp = {focusListener}
                                    />
                                </div>

                                <div className = "input-field">
                                    <span>Password</span>
                                    <input className= "login-input" type="password" value={password}
                                        onChange={function (e) {
                                            setPassword(e.target.value)
                                        }}
                                        onKeyUp = {focusListener}
                                    />
                                </div>
                                <div className="input-field">
                                    <button className = "login-btn" onClick={loginFn}>Log In</button>
                                </div>
                            </div>
                        </div>
                        <div className="input-container">
                            <div className = "signup-nav-container">
                                Don't have an account?&nbsp;<NavLink className = "nav-link" to = "/signup">Sign Up</NavLink>
                            </div>
                        </div>
                        {error ? <Error errorTitle = "Failed to Log In" error = {error}></Error> : <></>}
                    </div>
    )
}

export default Login
