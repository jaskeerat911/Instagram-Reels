import React, { useEffect, useState } from 'react'
import { database } from '../../FirebaseAuth/firebase';

function Likes(props) {
    let [like, setLike] = useState(null);
    let { userData, reelData } = props;

    useEffect(() => {
        let check = reelData.likes.includes(userData?.userId)?true:false;
        setLike(check);
    }, [reelData, userData?.userId])
    
    const handleLike = () => {
        if (like) {
            let likeArr = reelData.likes.filter(ele => {
                return ele !== userData?.userId;
            });

            database.reels.doc(reelData.videoId).update({
                likes : likeArr
            })
        }
        else {
            let likeArr = [...reelData.likes, userData.userId];
            console.log(likeArr)   
            database.reels.doc(reelData.videoId).update({
                likes : likeArr
            })
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
