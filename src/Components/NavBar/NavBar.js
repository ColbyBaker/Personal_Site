import './NavBar.css';
import React from 'react';
import {Link} from 'react-router-dom';

export default function NavBar(props) {
    return (
        <div className={`NavBar`} id={props.id}>
            <ul>
                <li>
                    <Link to={"/"} className={`Link`} id={"home-link"}>Home</Link>
                </li>
                <li>
                    {/* <Link to={"/projects"} className={`Link`} id={"projects-link"}>Projects</Link> */}
                    <a></a>
                </li>
                <li>
                    <Link to={"/resume"} className={`Link`} id={"resume-link"}>Résumé</Link>
                </li>
                <li>
                    <Link to={"/about_me"} className={`Link`} id={"about-me-link"}>About Me</Link>
                </li>
            </ul>
        </div>
    );
}