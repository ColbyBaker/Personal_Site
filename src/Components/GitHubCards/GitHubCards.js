import './GitHubCards.css';
import React, { useState, useEffect } from 'react';
import RepoCard from "../RepoCard/RepoCard.js";
import { Grid } from "@material-ui/core";
import { githubAPI } from '../../Util/Api.js';

const personalSiteDescription = "The code for the website you're viewing right now!"

export default function GitHubCards() {
    
    const title = [];
    const [repos, setRepos] = useState([]);
    const [language, setLanguage] = useState([]);

    useEffect(() => {
        let repoNames = ([
            'payroll-frontend', 'Atlas', 'jamming', 'ravenous', 'Personal_Site', 'BossMachine'
        ]);
        fetch("https://github-lang-deploy.herokuapp.com/")
            .then((response) => response.json())
            .then((response) => setLanguage(response.data));
            
        //to-do: refactor into Api.js
        repoNames.map(async (currentRepo) => {
            const response = await githubAPI.repo(currentRepo);
            //checks if repo is personal_site and changes description.
            if (response.data.id === 416565240) {
                response.data.description = personalSiteDescription;
            }
            setRepos((prevState) => {
                return [...prevState, response.data];
            })
        });
    }, []);

    return (
        <Grid container spacing={1}>
            {repos.map((currentRepo, i) => {
                return <RepoCard repo={currentRepo} key={i} language={language} />
            })}
        </Grid>
    )
}