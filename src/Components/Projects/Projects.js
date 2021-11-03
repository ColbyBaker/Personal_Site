import './Projects.css';
import React, { useState, useRef, useEffect } from 'react';
import { IsOnScreen } from '../../Util/Util.js';
import GitHubCards from '../GitHubCards/GitHubCards';

export default function Projects(props) {

    return (
        <div id="Projects" className={`Projects`}>
            <GitHubCards />
        </div>
    )
}