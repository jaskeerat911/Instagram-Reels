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
        const user = database.users.doc(currentUser.uid).onSnapshot((doc) => {
            // doc.data() is never undefined for query doc snapshots
            setUser(doc.data());
        });
        return () => {
            user();
        };
    }, [currentUser]);
    
    
    return (
        user == null ? <Loader></Loader> :
            <div className="feed-container">
                <Header user = {user} setUploadLoader={setUploadLoader}></Header>
                {uploadLoader ? <div className="linear-activity">
                    <div className="indeterminate"></div>
                </div> : <></>}
                <Reels user = {user}></Reels>
            </div>
    
    )
}

export default Feed;