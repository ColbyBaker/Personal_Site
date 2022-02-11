'use strict';
import { githubAPI } from "./Util/API";

const repos = ['payroll-frontend', 'Atlas', 'jamming', 'ravenous', 'Personal_Site', 'BossMachine'];

class RepoCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const repo = this.props.repo;
    return (
      <div className="repo-card" >
        <a href={repo.html_url}>{repo.name}</a>
        <p>{repo.description}</p>
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
            response.data.description = "The code for this site you're on right now!"
          }
          this.setState({
            repos: [...this.state.repos, response.data]
          })
          console.log(response)
        })
    });
  }



  render() {
    let githubCards;
    if (this.state.repos.length > 0) {
      githubCards = this.state.repos.map(currentRepo => {
        return <RepoCard repo={currentRepo} key={currentRepo.id}/>
      })
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