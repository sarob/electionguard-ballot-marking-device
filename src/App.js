import React, { Component } from 'react';
import PrintProvider, { Print, NoPrint } from 'react-easy-print';
import './App.css';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';


var ELECTION = {
  id: "DEMO",
  title: "Demo Election",
  contests: [
    {
      id: "president",
      type: "plurality",
      name: "President",
      options: [
        "Minnie Mouse",
        "Mickey Mouse",
        "Donald Duck"
        ]
    },
    {
      id: "senator",
      type: "plurality",
      name: "Senator",
      options: [
        "Chad Hanging",
        "Lev Ermachine",
        "John Smith"
        ]
    }
  ]
};

class BallotContest extends React.Component {
  handleChange = event => {
    let value = parseInt(event.target.value);
    this.setState({ value: value });
    this.choices[this.contestNum] = value;
  };

  constructor(props) {
    super(props);
    this.contest = props.contest;
    this.contestNum = props.contestNum;
    this.choices = props.choices;
    this.state = {value: this.choices[this.contestNum]};
  }
  
  render() {
    let contest = this.contest;

    let rows = []

    // Outer loop to create parent
    contest.options.forEach((option, i) => {
      rows.push(
        <FormControlLabel
          value={i}
          label={<Typography style={{fontSize: "2em"}}>{option}</Typography>}
          control={<Radio />}
          labelPlacement="end"
        />
      );
    });

    return (
      <FormControl component="fieldset">
        <FormLabel component="legend"><h2>{contest.name}</h2></FormLabel>
        <RadioGroup
          aria-label={contest.id}
          name={contest.id}
          value={this.state.value}
          onChange={this.handleChange}
        >
        {rows}
        </RadioGroup>
      </FormControl>
    );      
    
  }
}

class Ballot extends Component {
  constructor(props) {
    super(props);
    this.election = props.election;
    this.state = {position: 0, choices: []};
  }

  next() {
    this.setState({position: this.state.position+1, choices: this.state.choices});
  }

  previous() {
    this.setState({position: this.state.position-1, choices: this.state.choices});   }
  
  render() {
    let election = this.election;

    let buttons = [];
    if (this.state.position > 0) {
      buttons.push(
        <Button onClick={()=>{this.previous();}}>Previous</Button>
      );
    }

    buttons.push(
      <Button onClick={()=>{this.next();}}>Next</Button>
    );

    return (
      <div>
        <h1>{election.title}</h1>
        <p>
          <BallotContest
            key={this.state.position}
            contest={this.election.contests[this.state.position]}
            contestNum={this.state.position}
            choices={this.state.choices}
          />
        </p>
        {buttons}
      </div>
    );
  }
}

class PrintableBallot extends Component {
  constructor(props) {
    super(props);
    this.state = {election: props.election, ballot: props.ballot}
  }
  
  render() {
    let rows = []

    // Outer loop to create parent
    for (let contest of this.state.election.contests) {
      rows.push(<tr key={contest.id}><th align="left" width="30%">{contest.name}</th><td>{this.state.ballot?this.state.ballot[contest.id]:''}</td></tr>);
    }

    return (
      <table width="100%" style={{fontSize: "1.5em"}}>
        <tbody>
          <tr key="title"><th colSpan="2" style={{fontSize: "2em"}}>Official Ballot</th></tr>
          <tr key="space"><th>&nbsp;</th></tr>
          {rows}
        </tbody>
      </table>
    );      
  }
}

class App extends Component {
  print() {
    window.print();
  }
  
  render() {
    return (
      <PrintProvider>
	<Print single printOnly name="ballot">
          <PrintableBallot election={ELECTION} ballot={{president: "Mickey Mouse", senator: "John Smith"}} />
	</Print>
        
        <NoPrint force>
          <div className="App">
            <img src="./vw-checkmark.png" className="App-logo" alt="logo" />
            <Ballot election={ELECTION} />
          </div>
        </NoPrint>
      </PrintProvider>
    );
  }
}

export default App;
