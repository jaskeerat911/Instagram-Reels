import React, { useState } from "react";
import ShowPost from "./ShowPost";

function Posts(props) {
    let { user, posts } = props;
    let [showPost, setShowPost] = useState(null);

    const handlePost = (post) => {
        setShowPost(post);
    }

    return (
        <div className="posts">
            {posts.map(function (post, idx) {
                return (
                    <div className="post-container" key={idx} onClick={() => handlePost(post)}>
                        <div className="like-comment-container">
                            <div className="post-data-container like-container">
                                <span className="icons material-icons" id="like-icon">
                                    favorite
                                </span>
                                <span>{post.likes.length}</span>
                            </div>
                            <div className="post-data-container comment-container">
                                <span className="icons material-icons" id="comment-icon">
                                    mode_comment
                                </span>
                                <span>{post.comments.length}</span>
                            </div>
                        </div>
                        {post.fileType.split("/")[0] === "video" ? (
                            <>
                                <span className="material-icons" id="play-icon">
                                    play_arrow
                                </span>
                                <video src={post.postUrl} autoPlay={false}></video>
                            </>
                        ) : (
                            <img src={post.postUrl} alt="Post" />
                        )}
                    </div>
                );
            })}
            {showPost ? <ShowPost userData = {user} postData = {showPost} setShowPost = {setShowPost}></ShowPost> : <></>}
        </div>
    );
}

export default Posts;
