import React, { useContext, useEffect, useState } from 'react'
import "./Profile.css";
import Header from '../Header/Header';
import { AuthContext } from '../../Context/AuthProvider';
import { database } from '../../FirebaseAuth/firebase';
import Loader from '../Loader/Loader';
import reel from "./reel.mp4"

function Profile() {
    let { currentUser } = useContext(AuthContext);
    let [user, setUser] = useState(null);
    let [reels, setReels] = useState([]);
    let [uploadLoader, setUploadLoader] = useState(false);

    useEffect(() => {
        async function data() {
            let user = await database.users.doc(currentUser.uid).get();
            setUser(user.data());
        }
        data();
    }, []);

    useEffect(() => {
        async function data() {
            let entries = await database.reels.orderBy("createdAt", "desc").get();

            let reels = [];
            entries.forEach((entry) => {
                reels.push(entry.data());
            })

            setReels(reels);
        }
        data();
    },[reels])

    return (
        user ?<div className="profile-container">
                <Header user={user} setUploadLoader = {setUploadLoader}></Header>
                {uploadLoader ? <div className="linear-activity">
                                    <div className="indeterminate"></div>
                                </div> : <></>}
                <div className="user-profile-container">
                    <div className="user-credentials">
                        <div className="img-container">
                            <img src={user.profileUrl} alt="" />
                        </div>
                        <div className="bio">
                            <div id="user-name">{user.fullName}</div>
                        <div id="count-posts"><span>{reels.length}</span> posts</div>
                        </div>
                    </div>
                    <hr />
                    <div className="posts-container">
                        <div className="title"><span className="material-icons-outlined">apps</span>&nbsp;POSTS</div>
                    <div className="posts">
                        {reels.map(function (videoObj, idx) {
                            return (
                                <div className="post-container">
                                    <video
                                        src={videoObj.videoUrl}
                                        autoPlay={false}
                                    ></video>
                                </div>
                            )
                        })}
                        </div>
                    </div>
                </div>
            </div> : <Loader></Loader>
    )
}

export default Profile
