'use strict'
import { githubAPI } from "./Util/API";
import Colors from './Util/Colors';

const repos = ['payroll-frontend', 'Personal_Site', 'atlas', 'jamming', 'ravenous', 'BossMachine'];

class RepoCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getLanguages() {
    let languagePercentages = [];
    let languageList = [];
    for (const [language, percentage] of Object.entries(this.props.repo.languagePercentages)) {
      const color = Colors[language].color;

      const percentageSpanStyle = {
        flexGrow: `${percentage}`, 
        flexBasis: 0,
        overflow: "hidden",
        backgroundColor: color,
        height: "100%",
      }
      languagePercentages.push(<span style={percentageSpanStyle}></span>);
      const languageListItem = {
        minWidth: "100px",
      }
      const languageListSpanStyle = {
        display: "inline-block",
        height: "15px",
        width: "15px",
        backgroundColor: color,
      }
      languageList.push(<div style={languageListItem}><h3 style={{display: "inline-block", margin: "5px"}}>{language}</h3><span style={languageListSpanStyle}></span></div>);
    }
    const languagePercentagesContainerStyle = {
      height: "20px", 
      display: "flex", 
      alignItems: "center",
      border: "1px solid white",
      // borderRadius: "12px",
      // padding: "2px",
      overflow: "none",
    };

    const languageListContainerStyle = {
      display: "flex",
      flexWrap: "wrap",
    }

    return (
      <div style={{overflow: "auto", height: "120px", width: "100%"}}>
        <div style={languagePercentagesContainerStyle}>
          {languagePercentages}
        </div>
        <div style={languageListContainerStyle}>
          {languageList}
        </div>
      </div>

    )
  }

  render() {
    const repo = this.props.repo;
    return (
      <div className="repo-card" >
        <div className="title" style={{display: "flex", justifyContent: "space-between", width: "100%"}}>
          <a href={repo.html_url}>{`${repo.name}`}</a>
          <a href={repo.html_url}><img style={{height: "30px", flexGrow: "0"}} src="/assets/logos/hyperlink.png"></img></a>
        </div>
        <p>{repo.description}</p>
        {this.getLanguages()}
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