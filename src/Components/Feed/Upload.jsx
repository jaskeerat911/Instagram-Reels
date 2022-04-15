import React, {useState} from 'react'
import firebase, { database, storage } from '../../FirebaseAuth/firebase';
import uuid from "react-uuid"
import Error from '../Error/Error';

function Upload(props) {
    let {setUploadLoader} = props 
    let [error, setError] = useState(false);

    
    const handleUpload = async (e) => {
        let file = e?.target?.files[0];
        if (file == null) {
            setError("Please select a file");
            setTimeout(() => {
                setError(false);
            }, 2000);
        }
        else if (file.size / (1024 * 1024) > 100) {
            setError("The selected file is very big");
            setTimeout(() => {
                setError(false);
            }, 2000);
        }
        else {
            try {
                let ruid = uuid();
                
                const uploadListener = storage.ref("/posts/" + ruid).put(file);
                uploadListener.on("state_changed", onprogress, onerror, onsucess);

                function onprogress(snapshot) {
                    let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadLoader(Math.floor(progress));
                    console.log(Math.floor(progress));
                }

                function onerror(err) {
                    console.log(err);
                }

                async function onsucess() {
                    let downloadUrl = await uploadListener.snapshot.ref.getDownloadURL();
                    
                    let { user, uid } = props;
                    
                    database.posts.doc(ruid).set({
                        postId: ruid,
                        postUrl: downloadUrl,
                        authorName: user.fullName,
                        authourDPUrl: user.profileUrl,
                        fileType: file.type,
                        likes: [],
                        comments: [],
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    });

                    let updatedPostsIds = [...user.posts, ruid];
                    
                    database.users.doc(uid).update({
                        posts: updatedPostsIds,
                    });
                    setUploadLoader(0);
                }
            } catch (err) { }
        }
    }

    return (
        <div className = 'upload-container'>
            <span className=" icons material-icons-outlined" id="upload"
                onClick={function (e) {
                    e.target.nextSibling.click();
                }}
            >add_box</span>
            <input
                className="reel-upload"
                type="file" accept = "video/*, image/*"
                onChange={handleUpload}
            />
            {error ? <Error errorTitle = "Unable to Upload File" error = {error}></Error> : <></>}
        </div>
    )
}

export default Upload
