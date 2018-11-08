/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable import/extensions */
/* eslint-disable react/sort-comp */
import React from 'react';

import Lifelines from './lifelines.jsx';
import Trivia from './trivia.jsx';
import Timer from './timer.jsx';
import Scoreboard from './scoreBoard.jsx';
import VideoPlayer from './player.jsx';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      video: false,
      visibility: true,
      question: null,
    };
    this.triviaRequest = this.triviaRequest.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.nextTeam = this.nextTeam.bind(this);
    this.increaseScore = this.increaseScore.bind(this);
    this.triggerVideo = this.triggerVideo.bind(this);
    this.changeCat = this.changeCat.bind(this);
    this.currTeam = 'Team 1';
  }

  triviaRequest() {
    const url = `https://opentdb.com/api.php?amount=1&category=${sessionStorage.category}&difficulty=${sessionStorage.diff}&type=multiple`;
    fetch(url)
      .then(res => res.json())
      .then(data => this.setState({ question: data.results[0] }))
      .catch((err) => { console.error(err); });
  }

  changeCat() {
    const cats = [9, 11, 14, 15, 17, 22, 23, 26, 27];
    const rand = cats[Math.floor(Math.random() * cats.length)];
    const url = `https://opentdb.com/api.php?amount=1&category=${rand}&difficulty=${sessionStorage.diff}&type=multiple`;
    fetch(url)
      .then(res => res.json())
      .then((data) => {
        this.setState({ question: data.results[0] });
        sessionStorage.setItem('category', rand);
      })
      .catch((err) => { console.error(err); });
  }

  nextTeam() {
    const { currTeam } = this.state;
    return currTeam === 'Team 1' ? this.setState({ currTeam: 'Team 2' }) : this.setState({ currTeam: ' team 1' });
  }

  triggerVideo() {
    this.setState(prevState => ({ video: !prevState.video }));
  }

  increaseScore() {
    const { currTeam } = this.state;
    if (currTeam === 'Team 1') {
      sessionStorage.setItem('score1', (Number(sessionStorage.score1) + 1));
      this.setState(() => ({
        visibility: true,
      }));
    } else {
      sessionStorage.setItem('score2', (Number(sessionStorage.score2) + 1));
      this.setState(() => ({
        visibility: true,
      }));
    }
  }

  componentDidMount() {
    this.triviaRequest();
  }

  handleClick() {
    const { visibility } = this.state;
    this.setState({ visibility: !visibility });
  }

  render() {
    const {
      question, visibility, currTeam, team1, team2, video,
    } = this.state;
    const { name1, name2 } = this.props;
    if (!video) {
      return (
        <center>
          <div>
            <Lifelines
              handleChange={this.handleChange}
              triviaRequest={this.triviaRequest}
              handleClick={this.handleClick}
              changeCat={this.changeCat}
            />
            <Timer
              trigger={this.triggerVideo}
              // time state?
            />
            <Trivia
              triviaRequest={this.triviaRequest}
              handleChange={this.handleChange}
              question={question}
              hidden={visibility}
              nextTeam={this.nextTeam}
              increaseScore={this.increaseScore}
              trigger={this.triggerVideo}
            />
            <Scoreboard
              currTeam={currTeam}
              team1={team1}
              team2={team2}
              name1={name1}
              name2={name2}
            />
          </div>
        </center>
      );
    }
    return (
      <VideoPlayer />
    );
  }
}
export default Game;
