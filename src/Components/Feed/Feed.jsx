import './Feed.css';
import React, { useContext, useEffect, useState } from 'react'
import Header from '../Header/Header';
import Reels from './Reels';
import { AuthContext } from '../../Context/AuthProvider'
import { database } from '../../FirebaseAuth/firebase';
import Loader from "../Loader/Loader"

function Feed() {
    let { currentUser } = useContext(AuthContext);
    let [loader, setLoader] = useState(false);
    let [user, setUser] = useState(null);
    let [uplodLoader, setUploadLoader] = useState(false);

    useEffect(() => {
        async function data() {
            setLoader(true);
            let user = await database.users.doc(currentUser.uid).get();
            setUser(user.data());
        }
        data();
        setLoader(false);
    }, []);
    
    
    return (
        loader ? <Loader></Loader> :
        <div className = "feed-container">
            <Header user = {user} setUploadLoader = {setUploadLoader}></Header>
            {uplodLoader ? <div class="linear-activity">
                                <div class="indeterminate"></div>
                            </div> : <></>}
            <Reels user = {user}></Reels>
        </div>
    )
}

export default Feed;