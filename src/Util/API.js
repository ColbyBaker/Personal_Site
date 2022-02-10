import { request } from "https://cdn.skypack.dev/@octokit/request";
const githubAPI = {
    owner: "ColbyBaker",
    //apiKey: process.env.REACT_APP_GITHUB_TOKEN,
    userURL: `https://api.github.com/repos/ColbyBaker/`,
    personalSiteDescription: "",

    getRepo: async function(repoName) {
        const response = await request(`GET /repos/${this.owner}/${repoName}`, {
            // headers: {
            //     authorization: this.apiKey,
            // }
        });
        return response;
    },
}

export { githubAPI };