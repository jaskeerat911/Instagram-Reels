import "./Header.css"
import React, { useContext } from 'react'
import logo from '../Feed/Instagram-Logo.png';
import { NavLink } from 'react-router-dom'
import Upload from '../Feed/Upload';
import { AuthContext } from '../../Context/AuthProvider';

function Header(props) {
    let {genericLogout, currentUser} = useContext(AuthContext)
    let { user, setUploadLoader } = props

    const logOutFn = async (e) => {
        await genericLogout();
    }

    const handleDropdown = () => {
        let dropdownContent = document.querySelector(".header-container .function-container .dropdown-content");
        if (dropdownContent.style.display === "none") {
            dropdownContent.style.display = "block";
        }
        else {
            dropdownContent.style.display = "none";
        }
    }

    return (
        <div className="header-container">
            
            <div className="logo-container">
                <img src={logo} alt="Instagram" />
            </div>
            <div className="function-container">
                <NavLink to="/feed"><span className=" icons material-icons" id = "home">home</span></NavLink>
                <Upload user={user} uid={currentUser.uid} setUploadLoader={setUploadLoader}></Upload>
                <div className="dropdown" onClick = {handleDropdown}>
                    <img src={user?.profileUrl} alt="DP" className="icons" id="profilePic"/>
                    <div className="dropdown-content">
                        <NavLink to = "/profile">Profile</NavLink>
                        <div onClick = {logOutFn}>Log Out</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header
