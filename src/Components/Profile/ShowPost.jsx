import React, { useEffect, useState } from "react";
import Comments from "../Comments";
import Likes from "../Likes";
import { database } from "../../FirebaseAuth/firebase";
import "./ShowPost.css";

function ShowPost(props) {
    let { userData, postData, setShowPost } = props;
    let [post, setPost] = useState(postData);

    useEffect(() => {
        async function data() {
            let entries = await database.posts.get();

            entries.forEach((entry) => {
                let post = entry.data();
                if (post.postId === postData.postId) {
                    setPost(post);
                    return;
                } 
            });

        }
        return data();  
    }, [post, postData]);


    const postComment = async (videoObj, comment) => {
        let addComment = {
            [userData.fullName]: comment,
        };

        let updatedComments = [...videoObj.comments, addComment];

        database.posts.doc(videoObj.postId).update({
            comments: updatedComments,
        });
    };

    return (
        <div className="posts">
            {/* {console.log(post)} */}
            post != null ? (<div className="display-post">
                <span className="material-icons-outlined" id="close"
                    onClick={function () {
                        setShowPost(null)
                    }}>close</span>
                <div className="display-post-container">
                    <div className="image-container">
                        <div className="user-container">
                            <img src={postData.authourDPUrl} alt="DP" />
                            <div>{postData.authorName}</div>
                        </div>
                        <img src={postData.postUrl} alt="Post" />
                    </div>
                    <div className="comments-container">
                        <div className="user-container">
                            <img src={postData.authourDPUrl} alt="DP" />
                            <div>{postData.authorName}</div>
                        </div>
                        <Comments postData={post}></Comments>
                        <div className="button-container">
                            <Likes userData={userData} postData={post}></Likes>
                            <span className="icons material-icons-outlined" id="comment-icon">
                                mode_comment
                            </span>
                        </div>
                        <div className="likes-count">{post.likes.length} likes</div>
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
            </div>) : <></>
        </div> 
    );
}

export default ShowPost;
