// import './Feed.css';
import Header from './Header';
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../Context/AuthProvider'
import { database } from '../../FirebaseAuth/firebase';

function Feed() {
    let { currentUser } = useContext(AuthContext);
    let [user, setUser] = useState(null);

    useEffect(() => {
        async function data() {
            let user = await database.users.doc(currentUser.uid).get();
            setUser(user.data());
        }
        data();
    }, []);
    return (
        <div className = "feed-container">
            <Header user = {user}></Header>
            {/* <Reels></Reels> */}
        </div>
    )
}

export default Feed;