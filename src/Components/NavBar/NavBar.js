import './NavBar.css';
import React from 'react';
import {Link} from 'react-router-dom';

export default function NavBar(props) {
    return (
        <div className={`NavBar`} id={props.id}>
            <ul>
                <li>
                    <a href="#Home">Home</a>
                </li>
                <li>
                    <a href="#Projects">Projects</a>
                </li>
                <li>
                    <a href="#AboutMe">About Me</a>
                </li>
                <li>
                    <a href="#Resume">Résumé</a>
                </li>
            </ul>
        </div>
    );
}