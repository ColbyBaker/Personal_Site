'use strict'
import { githubAPI } from "./Util/API";

const repos = ['payroll-frontend', 'Personal_Site', 'Atlas', 'jamming', 'ravenous', 'BossMachine'];

class RepoCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getLanguagePercentages() {
    let languages = [];
    let color = "black";
    for (const [language, percentage] of Object.entries(this.props.repo.languagePercentages)) {
      const spanStyle = {
        flexGrow: `${percentage}`, 
        flexBasis: 0,
        overflow: "hidden",
        backgroundColor: color,
        height: "100%",
      }
      color == "black" ? color = "white" : color = "black";
      languages.push(<span style={spanStyle}></span>);
    }
    const containerStyle = {
      height: "20px", 
      display: "flex", 
      alignItems: "center",
      border: "1px solid white",
      // borderRadius: "12px",
      // padding: "2px",
      overflow: "none",
    };
    return (
      <div style={containerStyle}>
        {languages}
      </div>
    )
  }

  render() {
    const repo = this.props.repo;
    return (
      <div className="repo-card" >
        <a href={repo.html_url}>{repo.name}</a>
        <p>{repo.description}</p>
        {/* {this.getLanguagePercentages()} */}
      </div>
    )
  }
}

class GithubCards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      repos: []
    };
  }

  componentDidMount() {
    repos.forEach(currentRepo => {
      githubAPI.getRepo(currentRepo)
        .then(response => {
          if (currentRepo == 'Personal_Site') {
            response.data.description = "The code for the site you're on right now!"
          }
          fetch(response.data.languages_url)
            .then(languageResponse => languageResponse.json())
            .then(languageResponse => {
              response.data.languagePercentages = languageResponse
              this.setState({
                repos: [...this.state.repos, response.data]
              });
            });
        });
    });
  }



  render() {
    let githubCards;
    if (this.state.repos.length > 0) {
      githubCards = this.state.repos.sort((repoA, repoB) => {
        const repoAIndex = repos.findIndex((currentRepo) => {
          return currentRepo === repoA.name;
        })
        const repoBIndex = repos.findIndex((currentRepo) => {
          return currentRepo === repoB.name;
        })
        return repoAIndex - repoBIndex;
      })
      githubCards = githubCards.map(currentRepo => {
        return <RepoCard repo={currentRepo} key={currentRepo.id}/>
      });
    }

    return (
      <div className="github-cards">
        {githubCards}
      </div>
    )
  }
}

const domContainer = document.querySelector('#react-github-cards');
ReactDOM.render(<GithubCards/>, domContainer);