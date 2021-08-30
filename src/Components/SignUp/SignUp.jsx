import "./SignUp.css";
import logo from "./Instagram-Logo.png";
import React, { useContext, useState} from "react";
import { AuthContext } from "../../Context/AuthProvider";
import { storage, database } from "../../FirebaseAuth/firebase";
import { NavLink, useHistory } from "react-router-dom";
import Error from "../Error/Error";
import Loader from "../Loader/Loader";

function SignUp(props) {
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [fullName, setFullName] = useState("");
    let [file, setFile] = useState(null);
    let [error, setError] = useState("");
    let [loader, setLoader] = useState(false);
    let history = useHistory();

    let { genericSignup} = useContext(AuthContext);

    // useEffect(() => {
    //     if (currentUser && !loader) {
    //         // send to feed page
    //         props.history.push('/feed');
    //     }
    // });

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
            setLoader(true);
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
                    userId : uid,
                    email: email,
                    fullName: fullName,
                    profileUrl: downloadUrl,
                    posts: [],
                    likes: [],
                    comments: [],
                });
            }

            history.push('/feed');

        } catch (err) {
            setLoader(false)
            if (!email) {
                setError("Email Field is Empty");
            }
            else if (!fullName) {
                setError("Name Field is Empty");
            }
            else if (!password) {
                setError("Password Field is Empty");
            }
            else {
                setError("Email is already existed");
                setEmail("");
                setFullName("");
                setPassword("");
                setFile(null);
            }

            setTimeout(() => {
                setError(false);
            }, 2000);
        }
    };

    return (
        loader ? <Loader></Loader> :
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
                        <div className="file-upload-wrapper" data-text = 'Select your Profile Pic'>
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
                {error ? <Error errorTitle = "Failed to Sign Up" error = {error}></Error> : <></>}
            </div>
    );
}

export default SignUp;
