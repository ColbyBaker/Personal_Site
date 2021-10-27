import React, { useState } from 'react';
import './Home.css';
import BannerHeader from '../BannerHeader/BannerHeader.js';
import Projects from '../Projects/Projects.js';
import Resume from '../Resume/Resume.js';
import AboutMe from '../AboutMe/AboutMe.js';

export default function Home () {

    return (
        <div className={"Home"}>
            <BannerHeader />
            <Projects />
            <Resume />
            <AboutMe />
        </div>
    ) 
}