import './Feed.css'
import home from "./home-icon.png";
import logo from "./Instagram-Logo.png";
import React from 'react'
import {NavLink} from "react-router-dom"

function Header(props) {
    let { user } = props;
    return (
        <div className = 'header-container'>
            <div className="logo-container">
                <img src={logo} alt="Instagram" />
            </div>
            <div className="function-container">
                <NavLink to = "/feed"><img id="home" src={home} alt="Home" /></NavLink>
                <NavLink to = "/profile"><img id= "profilePic" src={user?.profileUrl} alt="DP" /></NavLink>
            </div>
        </div>
    )
}

export default Header
