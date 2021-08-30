import React, { useEffect, useState } from 'react'
import { database } from '../FirebaseAuth/firebase';

function Likes(props) {
    let [like, setLike] = useState(null);
    let { userData, postData } = props;

    useEffect(() => {
        let check = postData.likes.includes(userData?.userId)?true:false;
        setLike(check);
    }, [postData, userData?.userId])
    
    const handleLike = () => {
        if (like) {
            let likeArr = postData.likes.filter(ele => {
                return ele !== userData?.userId;
            });

            database.posts.doc(postData.postId).update({
                likes : likeArr
            })
            setLike(false);
        }
        else {
            let likeArr = [...postData.likes, userData.userId];
            database.posts.doc(postData.postId).update({
                likes : likeArr
            })

            setLike(true);
        }
    }

    return (
        like != null ?
            (like === false ?
            <span
                className="icons material-icons-outlined"
                id="like-icon"
                onClick={handleLike}
            >
            favorite_border
            </span> :
            <span
                className="icons material-icons-outlined liked"
                id="like-icon"
                onClick={handleLike}
            >
            favorite
            </span>) : <></>
    )
}

export default Likes
