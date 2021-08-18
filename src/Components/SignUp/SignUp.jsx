import "./SignUp.css";
import logo from "./Instagram-Logo.png";
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../Context/AuthProvider";
import { storage, database } from "../../FirebaseAuth/firebase";
import { NavLink } from "react-router-dom";

function SignUp(props) {
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [fullName, setFullName] = useState("");
    let [file, setFile] = useState(null);

    let { genericSignup, currentUser } = useContext(AuthContext);

    useEffect(() => {
        if (currentUser) {
            // send to feed page
            props.history.push('/feed');
        }
    });

    const focusListener = (e) => {
        if (e.target.value) {
            e.target.parentElement.classList.add('focus');
        }
        else {
            e.target.parentElement.classList.remove('focus');
        }
    }

    const signupFn = async () => {
        console.log("sign up function called");
        try {
            let userCredential = await genericSignup(email, password);
            let uid = userCredential.user.uid;

            const uploadListener = storage.ref("/users/" + uid).put(file);
            uploadListener.on("state_changed", onprogress, onerror, onsuccess);

            function onprogress(snapshot) {
                let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(progress);
            }

            function onerror(err) {
                console.log(err);
            }

            async function onsuccess() {
                let downloadUrl = await uploadListener.snapshot.ref.getDownloadURL();

                database.users.doc(uid).set({
                    email: email,
                    fullName: fullName,
                    profileUrl: downloadUrl,
                    reels: [],
                    likes: [],
                    comments: [],
                });
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="signup-container">
            <div className="input-container">
                <div className="logo-container">
                    <img src={logo} alt="Instagram" />
                    <div>Sign up to see photos and videos from your friends.</div>
                </div>
                <div className="input-field-container">
                    <div className="input-field">
                        <span>Email</span>
                        <input
                            className="login-input"
                            type="email"
                            value={email}
                            onChange={function (e) {
                                setEmail(e.target.value);
                            }}
                            onKeyUp = {focusListener}
                        />
                    </div>
                    <div className="input-field">
                        <span>Full Name</span>
                        <input
                            className="login-input"
                            type="text"
                            value={fullName}
                            onChange={function (e) {
                                setFullName(e.target.value);
                            }}
                            onKeyUp = {focusListener}
                        />
                    </div>
                    <div className="input-field">
                        <span>Password</span>
                        <input
                            className="login-input"
                            type="password"
                            value={password}
                            onChange={function (e) {
                                setPassword(e.target.value);
                            }}
                            onKeyUp = {focusListener}
                        />
                    </div>
                    <div className="file-upload-wrapper" data-text = 'Select your file'>
                        <input
                            className="login-input"
                            type="file" accept = "image/*"
                            onChange={function (e) {
                                let file = e.target.files[0];
                                if (file != null) setFile(file);
                                e.target.parentElement.setAttribute('data-text', file.name);
                            }}
                        />
                    </div>
                    <div className="input-field">
                        <button className="signup-btn" onClick={signupFn}>Sign Up</button>
                    </div>
                    <div className = "terms">By signing up, you agree to our <b>Terms</b> , <b>Data Policy</b> and <b>Cookies Policy</b> .</div>
                </div>
            </div>
            <div className="input-container">
                <div className = "login-nav-container">
                    Have an account?&nbsp;<NavLink className = "nav-link" to = "/login">Log In</NavLink>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
