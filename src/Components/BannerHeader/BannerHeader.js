import './BannerHeader.css';
import React, { useState } from 'react';
import NavBar from '../NavBar/NavBar.js';
import headshot from '../../resources/images/headshot_cropped.jpeg';
import { IsOnScreen } from '../../Util/Util';

export default function BannerHeader(props) {

    const [mainClassName, setMainClassName] = useState("isBanner");
    const [containerClassName, setContainerClassName] = useState("bannerContainer");

    const changeClass = () => {
        mainClassName === "isHeader" ? setMainClassName("isBanner") : setMainClassName("isHeader");
        containerClassName === "headerContainer" ? setContainerClassName("bannerContainer") : setContainerClassName("headerContainer");
    }

    const [setRef, visible] = IsOnScreen();
    return(
        <div className={`${containerClassName}`}>
            <div ref={setRef} className="upper-trigger"></div>
            <div className={`${mainClassName}`}>
                <img src={headshot}/>
                <h1>
                    Colby Baker : Full Stack Web Developer
                </h1>
                <NavBar id={"BannerHeader-NavBar"}/>
                <button onClick={changeClass}>stuff</button>
            </div>
        </div>
    )
}