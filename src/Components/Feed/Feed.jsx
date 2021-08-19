import './Feed.css';
import React, { useContext, useEffect, useState } from 'react'
import Header from '../Header/Header';
import Reels from './Reels';
import { AuthContext } from '../../Context/AuthProvider'
import { database } from '../../FirebaseAuth/firebase';
import Loader from "../Loader/Loader"

function Feed() {
    let { currentUser } = useContext(AuthContext);
    let [user, setUser] = useState(null);
    let [uploadLoader, setUploadLoader] = useState(false);

    useEffect(() => {
        async function data() {
            let user = await database.users.doc(currentUser.uid).get();
            setUser(user.data());
        }
        data();
    }, []);
    
    
    return (
        user ?<div className = "feed-container">
                <Header user = {user} setUploadLoader = {setUploadLoader}></Header>
                {uploadLoader ? <div className="linear-activity">
                                    <div className="indeterminate"></div>
                                </div> : <></>}
                <Reels user = {user}></Reels>
            </div> : <Loader></Loader>
    )
}

export default Feed;