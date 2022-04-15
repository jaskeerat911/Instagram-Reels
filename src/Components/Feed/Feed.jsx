import './Feed.css';
import React, { useContext, useEffect, useState } from 'react'
import Header from '../Header/Header';
import Posts from './Posts';
import { AuthContext } from '../../Context/AuthProvider'
import { database } from '../../FirebaseAuth/firebase';
import Loader from "../Loader/Loader"

function Feed() {
    let { currentUser } = useContext(AuthContext);
    let [user, setUser] = useState(null);
    let [uploadLoader, setUploadLoader] = useState(0);

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
                {uploadLoader > 0 ? <div className="linear-activity">
                    <div className="indeterminate" style={{ width: `${uploadLoader}%`}}></div>
                </div> : <></>}
                {/* {uploadLoader === 0 ? 
                    <input type="range" min = "0" max = "100" value = {uploadLoader} className='upload-progress-bar' /> : <></>} */}
                <Posts user = {user}></Posts>
            </div>
    
    )
}

export default Feed;