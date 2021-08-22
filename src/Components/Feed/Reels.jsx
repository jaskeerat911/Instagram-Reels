import "./Reels.css";
import React, { useEffect, useState } from "react";
import Likes from "./Likes";
import Comments from "./Comments";
import { database } from "../../FirebaseAuth/firebase";
import Loader from "../Loader/Loader";

function Reels(props) {
    let { user } = props;
    let [reels, setReels] = useState(null);

    useEffect(() => {
        async function data() {
            let entries = await database.reels.orderBy("createdAt", "desc").get();

            let reels = [];
            entries.forEach((entry) => {
                reels.push(entry.data());
            });

            setReels(reels);
        }
        data();
    }, [reels]);

    const postComment = async (videoObj, comment) => {
        let addComment = {
            [user.fullName]: comment,
        };

        let updatedComments = [...videoObj.comments, addComment];

        database.reels.doc(videoObj.videoId).update({
            comments: updatedComments,
        });
    };

    const handleVolume = (e) => {
        let video = e.target.nextSibling.nextSibling;
        video.muted = !video.muted;
    };

    return (
        user == null || reels == null ? <Loader></Loader> :
            <div className="reels-container">
                {reels.map(function (reel, idx) {
                    return (
                        <div className="reel-container" key={idx}>
                            <div className="user-container">
                                {user ? <img src={reel.authourDPUrl} alt="DP" /> : <></>}
                                {user ? <div>{reel.authorName}</div> : <></>}
                            </div>
                            <div className="video-container">
                                <span className="material-icons" id="mute-icon" onClick={handleVolume}>
                                    volume_off
                                </span>

                                <span
                                    className="material-icons"
                                    id="play-icon"
                                    onClick={function (e) {
                                        e.target.nextSibling.click();
                                    }}
                                >
                                    play_arrow
                                </span>

                                <video
                                    src={reel.videoUrl}
                                    autoPlay={false}
                                    controls={false}
                                    onClick={function (e) {
                                        if (!e.target.paused) {
                                            e.target.previousSibling.style.display = "block";
                                            e.target.pause();
                                        } else {
                                            e.target.previousSibling.style.display = "none";
                                            e.target.play();
                                        }
                                    }}
                                ></video>
                            </div>
                            <div className="button-container">
                                <Likes userData = {user} reelData = {reel}></Likes>
                                <span className="icons material-icons-outlined" id="comment-icon">
                                    mode_comment
                                </span>
                            </div>
                            <div className="comment-container">
                                <div className="likes">{reel.likes.length} likes</div>
                                <Comments reelData = {reel}></Comments>
                                <div className="comment-box">
                                    <input
                                        type="text"
                                        placeholder="Add a Commment..."
                                        onChange={function (e) {
                                            if (e.target.value) {
                                                e.target.nextSibling.removeAttribute("disabled");
                                            } else {
                                                e.target.nextSibling.disabled = true;
                                            }
                                        }}
                                        onKeyUp={function (e) {
                                            if (e.key === "Enter") {
                                                let value = e.target.value;
                                                postComment(reel, value);
                                                e.target.value = "";
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={function (e) {
                                            let value = e.target.previousSibling.value;
                                            postComment(reel, value);
                                            e.target.previousSibling.value = "";
                                        }}
                                        // disabled
                                    >
                                        POST
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
    );
}

export default Reels;
