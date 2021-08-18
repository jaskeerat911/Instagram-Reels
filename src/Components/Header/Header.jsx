import "./Header.css"
import React, { useContext } from 'react'
import logo from '../Feed/Instagram-Logo.png';
import { NavLink } from 'react-router-dom'
import Upload from '../Feed/Upload';
import { AuthContext } from '../../Context/AuthProvider';

function Header(props) {
    let {currentUser} = useContext(AuthContext)
    let { user, setUploadLoader } = props

    return (
        <div className = "header-container">
            <div className="logo-container">
                <img src={logo} alt="Instagram" />
            </div>
            <div className="function-container">
                <NavLink to="/feed"><span className=" icons material-icons" id = "home">home</span></NavLink>
                <Upload user = {user} uid = {currentUser.uid} setUploadLoader = {setUploadLoader}></Upload>
                {user ? <NavLink to = "/profile"><img src={user.profileUrl} alt="DP" className = "icons" id = "profilePic" /></NavLink> : <></>}
            </div>
        </div>
    )
}

export default Header
