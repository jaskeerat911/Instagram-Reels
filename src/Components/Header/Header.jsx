import "./Header.css"
import React, { useContext } from 'react'
import logo from '../Feed/Instagram-Logo.png';
import { NavLink } from 'react-router-dom'
import Upload from '../Feed/Upload';
import { AuthContext } from '../../Context/AuthProvider';
import Loader from "../Loader/Loader";

function Header(props) {
    let {genericLogout, currentUser} = useContext(AuthContext)
    let { user, setUploadLoader } = props

    const logOutFn = async (e) => {
        await genericLogout();
    }

    return (
        user ? <div className = "header-container">
            <div className="logo-container">
                <img src={logo} alt="Instagram" />
            </div>
            <div className="function-container">
                <NavLink to="/feed"><span className=" icons material-icons" id = "home">home</span></NavLink>
                <Upload user={user} uid={currentUser.uid} setUploadLoader={setUploadLoader}></Upload>
                <div class="dropdown">
                    <img src={user.profileUrl} alt="DP" className="icons" id="profilePic"/>
                    <div class="dropdown-content">
                        <NavLink to = "/profile">Profile</NavLink>
                        <div onClick = {logOutFn}>Log Out</div>
                    </div>
                </div>
            </div>
        </div> : <Loader></Loader>
    )
}

export default Header
