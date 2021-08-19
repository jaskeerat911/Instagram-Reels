import "./Reels.css";
import React, { useContext, useEffect, useState } from 'react'
import { database } from '../../FirebaseAuth/firebase';
import { AuthContext } from "../../Context/AuthProvider";
import userEvent from "@testing-library/user-event";

function Reels() {
    let { currentUser } = useContext(AuthContext);
    let [user, setUser] = useState(null);
    let [reels, setReels] = useState([]);

    useEffect(() => {
        async function data() {
            let user = await database.users.doc(currentUser.uid).get();
            setUser(user.data());
        }
        data();
    }, [user]);

    const handleLike = async (videoObj, e) => {
        let likesCount = videoObj.likes;
        if (e.target.classList.contains('liked')) {
            e.target.classList.remove("liked")
            e.target.innerText = "favorite_border";
            
            database.reels.doc(videoObj.videoId).update({
                likes: likesCount - 1
            })

            let likeArray = user.likes.filter(function (value) {
                return value !== videoObj.videoId
            });

            database.users.doc(currentUser.uid).update({
                likes: likeArray
            })

            
        }
        else {
            e.target.classList.add('liked');
            e.target.innerText = "favorite";

            database.reels.doc(videoObj.videoId).update({
                likes: likesCount + 1
            })

            let likeArray = [...user.likes, videoObj.videoId];
            database.users.doc(currentUser.uid).update({
                likes: likeArray
            })
        }

    }

    const handleVolume = (e) => {
        let video = e.target.nextSibling.nextSibling;
        video.muted = !video.muted;
    }

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
        <div className = 'reels-container'>
            {reels.map(function (videoObj, idx) {
                return (
                    <div className="reel-container" key={idx}>
                        <div className="user-container">
                            {user ? <img src={videoObj.authourDPUrl} alt="DP" /> : <></>}
                            {user ? <div>{videoObj.authorName}</div> : <></>}
                        </div>
                        <div className="video-container">

                            <span className="material-icons" id="mute-icon"
                                onClick={handleVolume}
                            >volume_off</span>
                            
                            <span className="material-icons" id="play-icon"
                                onClick={function (e) {
                                    e.target.nextSibling.click();
                                }}
                            >play_arrow</span>

                            <video
                                src={videoObj.videoUrl}
                                autoPlay={false}
                                controls={false}
                                onClick={function (e) {
                                    if (!e.target.paused) {
                                        e.target.previousSibling.style.display = "block"
                                        e.target.pause();
                                    }
                                    else {
                                        e.target.previousSibling.style.display = "none"
                                        e.target.play();
                                    }
                                }}
                            >
                            </video>
                        </div>
                        <div className="button-container">
                            {user.likes.includes(videoObj.videoId) ?
                                <span className="icons material-icons-outlined liked" id="like-icon"
                                    onClick={handleLike.bind(this,videoObj)}
                                >favorite</span> : 
                                <span className="icons material-icons-outlined" id="like-icon"
                                    onClick={handleLike.bind(this,videoObj)}
                                >favorite_border</span>}
                            <span className="icons material-icons-outlined" id = "comment-icon">mode_comment</span>
                        </div>
                        <div className="comment-container">
                            <div className="likes">{videoObj.likes} likes</div>
                            <div className="comments">
                                <div className="comment">
                                    <div id="user-name">Jakeerat</div>
                                    <div>hello!! how are you?</div>
                                </div>
                                <div className="comment">
                                    <span id="user-name">Jakeerat</span>
                                    <span id = "user-comment">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quam, non laborum culpa ducimus illum doloremque amet dolorum asperiores consequuntur ipsa nesciunt perferendis. Ratione, impedit rem. Beatae maiores natus, voluptates, sint eum hic saepe quibusdam doloribus neque fuga iure, tempore cum repellendus? Ut repudiandae impedit aperiam harum. Itaque iste autem reiciendis.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Reels
