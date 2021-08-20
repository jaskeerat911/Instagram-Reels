import React from 'react'
import "./Error.css"

function Error(props) {
    let { error, errorTitle } = props;
    return (
        <div className="error-container">
            <div className="error-box">
                <div className="error">
                    <div className="error-title">
                        <div>{errorTitle}</div>
                    </div>
                    <div className="error-message">{error}</div>
                </div>
                <div className="button-container">
                    <button>Ok</button>
                </div>
            </div>
        </div>
    )
}

export default Error
