import "./Posts.css";
import React, { useEffect, useState } from "react";
import Likes from "../Likes";
import Comments from "../Comments";
import { database } from "../../FirebaseAuth/firebase";
import Loader from "../Loader/Loader";

function Posts(props) {
    let { user } = props;
    let [posts, setPosts] = useState(null); 

    useEffect(() => {
        async function data() {
            let entries = await database.posts.orderBy("createdAt", "desc").get();

            let posts = [];
            entries.forEach((entry) => {
                posts.push(entry.data());
            });

            setPosts(posts);
        }
        return data();  
    }, [posts]);

    const postComment = async (videoObj, comment) => {
        let addComment = {
            [user.fullName]: comment,
        };

        let updatedComments = [...videoObj.comments, addComment];

        database.posts.doc(videoObj.postId).update({
            comments: updatedComments,
        });
    };

    const handleVolume = (e) => {
        let video = e.target.nextSibling.nextSibling;
        video.muted = !video.muted;
    };

    return user == null || posts == null ? (
        <Loader></Loader>
    ) : (
        <div className="posts-container">
            {posts.map(function (post, idx) {
                return (
                    <div className="post-container" key={idx}>
                        <div className="user-container">
                            {user ? <img src={post.authourDPUrl} alt="DP" /> : <></>}
                            {user ? <div>{post.authorName}</div> : <></>}
                        </div>
                        {post.fileType.split("/")[0] === 'video' ?
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
                                    src={post.postUrl}
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
                                ></video>{" "}
                            </div> : 
                            <div className="image-container">
                                <img src={post.postUrl} alt="Post" />
                            </div>
                        }
                        <div className="button-container">
                            <Likes userData={user} postData={post}></Likes>
                            <span className="icons material-icons-outlined" id="comment-icon">
                                mode_comment
                            </span>
                        </div>
                        <div className="comment-container">
                            <div className="likes">{post.likes.length} likes</div>
                            <Comments postData={post}></Comments>
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
                                            postComment(post, value);
                                            e.target.value = "";
                                        }
                                    }}
                                />
                                <button
                                    onClick={function (e) {
                                        let value = e.target.previousSibling.value;
                                        postComment(post, value);
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

export default Posts;
