import React from "react"
import '../styles/Uxhelper.css'

export const Uxhelper = () => {
    return (
        <div>
            <div className="eye" id="left-eye">
                <div className="pupil" id="left-pupil"></div>
            </div>
            <div className="eye" id="right-eye">
                <div className="pupil" id="right-pupil"></div>
            </div>
        </div>
    )
}