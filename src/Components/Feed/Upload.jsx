import React from 'react'
import firebase, { database, storage } from '../../FirebaseAuth/firebase';
import uuid from 'react-uuid';

function Upload(props) {
    let {setUploadLoader} = props 
    
    const handleUpload = async (e) => {
        let file = e?.target?.files[0];
        
        if (file != null)
            try {
                let ruid = uuid();
                
                const uploadListener = storage.ref("/reels/" + ruid).put(file);
                uploadListener.on("state_changed", onprogress, onerror, onsucess);

                function onprogress(snapshot) {
                    setUploadLoader(true);
                    let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(progress);
                }

                function onerror(err) {
                    console.log(err);
                }

                async function onsucess() {
                    let downloadUrl = await uploadListener.snapshot.ref.getDownloadURL();
                    
                    let { user, uid } = props;
                    
                    database.reels.doc(ruid).set({
                        videoUrl: downloadUrl,
                        authorName: user.fullName,
                        authourDPicUrl: user.profileUrl,
                        likes: [],
                        comments: [],
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    });

                    let updatedReelsIds = [...user.reels, ruid];
                    
                    database.users.doc(uid).update({
                        reels: updatedReelsIds,
                    });
                    setUploadLoader(false);
                }
            } catch (err) {}
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
                type="file" accept = "video/*"
                onChange={handleUpload}
            />
        </div>
    )
}

export default Upload
