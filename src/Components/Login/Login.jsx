import './Login.css';
import logo from './Instagram-Logo.png';
import React, { useState, useContext, useEffect } from 'react'
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthProvider'

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
            setError(err.message);
            setTimeout(() => {
                setError(false);
            }, 2000);
        }
    }

    console.log(currentUser);
    useEffect(() => {
        if (currentUser) {
            props.history.push('/feed')
        }
    })
 
    return (
        loginLoader ? <h1>Loding...</h1> :
            currentUser ? <></> :
                <div className = "container">
                    <div className="login-container">
                        <div className="logo-container">
                            <img src={logo} alt="Instagram" />
                        </div>
                        <div className="input-container">
                            <div className = "input-field">
                                <span>Email</span>
                                <input className = "login-input" type="email" value={email}
                                    onChange={function (e) {
                                        setEmail(e.target.value)
                                    }}
                                />
                            </div>

                            <div className = "input-field">
                                <span>Password</span>
                                <input className= "login-input" type="password" value={password}
                                    onChange={function (e) {
                                        setPassword(e.target.value)
                                    }}
                                />
                            </div>
                            <button className = "login-btn" onClick={loginFn}>Log In</button>
                        </div>
                        {/* {error ? <h1>{error}</h1> : <></>} */}
                    </div>
                    <div className="signup-nav-container">
                        <div>
                            Don't have an account? <NavLink className = "nav-link" to = "/signup">Sign Up</NavLink>
                        </div>
                    </div>
                    {error ? <h1>{error}</h1> : <></>}
                </div>
    )
}

export default Login
