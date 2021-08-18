import "./Reels.css";
import React, { useEffect, useState } from 'react'
import { database } from '../../FirebaseAuth/firebase';

function Reels(props) {
    let { user } = props;
    let [reels, setReels] = useState([]);

    const handleLike = (e) => {
        if (e.target.classList.contains('liked')) {
            e.target.classList.remove("liked")
            e.target.innerText = "favorite_border";
        }
        else {
            e.target.classList.add('liked');
            e.target.innerText = "favorite"
        }
    }

    const handleVolume = () => {
        let video = document.querySelector(".video-container video");
        video.muted = !video.muted;
        console.log("muted")
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
                        <div className="profile-container">
                            {user ? <img src={user.profileUrl} alt="DP" /> : <></>}
                            {user ? <div>{user.fullName}</div> : <></>}
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
                                autoPlay={true}
                                muted={true}
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
                            <span className="icons material-icons-outlined" id="like-icon"
                                onClick={handleLike}
                            >favorite_border</span>
                            <span className="icons material-icons-outlined" id = "comment-icon">mode_comment</span>
                        </div>
                        {/* <div className="comment-container">
                            <div className="likes">30 likes</div>
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
                        </div> */}
                    </div>
                )
            })}
        </div>
    )
}

export default Reels
