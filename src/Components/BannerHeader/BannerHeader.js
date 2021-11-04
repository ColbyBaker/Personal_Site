import './BannerHeader.css';
import React, { useState } from 'react';
import NavBar from '../NavBar/NavBar.js';
import headshot from '../../resources/images/headshot_cropped.jpeg';
import { IsOnScreen } from '../../Util/Util';

export default function BannerHeader(props) {

    const [setRef, visible] = IsOnScreen();
    let mainClassName = "isHeader";
    // visible ? mainClassName = "isBanner" :  mainClassName = "isHeader";
    let containerClassName = "active";
    return(
        <div className={`${containerClassName}`}>
            <div ref={setRef} className="upper-trigger"></div>
            <div className={`${mainClassName}`}>
                <img src={headshot}/>
                <h1>
                    Colby Baker : Full Stack Web Developer
                </h1>
                <NavBar id={"BannerHeader-NavBar"}/>
            </div>
        </div>
    )
}