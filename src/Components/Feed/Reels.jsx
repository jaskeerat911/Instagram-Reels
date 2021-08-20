import "./Reels.css";
import React, { useContext, useEffect, useState } from 'react'
import { database } from '../../FirebaseAuth/firebase';
import { AuthContext } from "../../Context/AuthProvider";

function Reels() {
    let { currentUser } = useContext(AuthContext);
    let [user, setUser] = useState(null);
    let [reels, setReels] = useState([]);
    let [comments, setComments] = useState([]);

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

    const postComment = async (videoObj, e) => {
        let addComment = {
            [user.fullName] : e.target.value
        };

        let updatedComments = [...videoObj.comments, addComment];
        
        setComments(updatedComments);
        database.reels.doc(videoObj.videoId).update({
            comments : updatedComments
        })

        e.target.value = "";
    }

    const handleVolume = (e) => {
        let video = e.target.nextSibling.nextSibling;
        video.muted = !video.muted;
    }

    useEffect(() => {
        async function data() {
            let entries = await database.reels.orderBy("createdAt", "desc").get();

            let reels = [];
            let comments = [];
            entries.forEach((entry) => {
                reels.push(entry.data());
                let allComments = entry.data().comments;
                allComments.forEach((comment) => {
                    comments.push(comment);
                })
            })

            setReels(reels);
            setComments(comments);
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
                                {comments.map(function (commentObj, idx) {
                                    return (
                                        Object.entries(commentObj).map(function ([key, value]) {
                                            return (
                                                <div className="comment" key={idx}>
                                                    <div id="user-name">{key}</div>
                                                    <div>{value}</div>
                                                </div>
                                            )
                                        })
                                    )
                                })}
                            </div>
                            <div className="comment-box">
                                <input type="text" placeholder="Add a Commment..."
                                    onChange={function (e) {
                                        if(e.target.value){
                                            e.target.nextSibling.removeAttribute("disabled")
                                        }
                                        else {
                                            e.target.nextSibling.disabled = true;
                                        }
                                    }}
                                    onKeyUp={function (e) {
                                        if (e.key === 'Enter') {
                                            postComment(videoObj, e)
                                        }
                                    }}
                                />
                                <button
                                    onClick={postComment.bind(this, videoObj)}
                                    // disabled
                                >POST</button>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Reels
