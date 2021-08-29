import React, { useState, useEffect } from 'react'

function Comments(props) {
    let [comments, setComments] = useState(null);
    let { postData } = props;

    useEffect(() => {
        let commentArr = [...postData.comments];

        setComments(commentArr);
    }, [postData])

    return (
        comments != null ?
            <div className="comments">
                {comments.map(function (commentObj, idx) {
                    return Object.entries(commentObj).map(function ([key, value]) {
                        return (
                            <div className="comment" key={idx}>
                                <div id="user-name">{key}</div>
                                <div>{value}</div>
                            </div>
                        );
                    });
                })}
            </div> : <></>
    )
}

export default Comments
