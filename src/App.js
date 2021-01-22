import React from 'react';
import './App.css';

const antigenStats = {
  "C":   {row:1, col:1, rhReq:true,  rhPosRat:0.0000, rhNegRat:0.0000},
  "c":   {row:1, col:2, rhReq:true,  rhPosRat:0.0000, rhNegRat:0.0000},
  "E":   {row:1, col:3, rhReq:true,  rhPosRat:0.0000, rhNegRat:0.0000},
  "e":   {row:1, col:4, rhReq:true,  rhPosRat:0.0000, rhNegRat:0.0000},
  "K":   {row:1, col:5, rhReq:false, ratio:   0.0000},
  "k":   {row:1, col:6, rhReq:false, ratio:   0.0000},
  "Fya": {row:1, col:7, rhReq:false, ratio:   0.0000},
  "Fyb": {row:1, col:8, rhReq:false, ratio:   0.0000},
  "M":   {row:2, col:1, rhReq:false, ratio:   0.0000},
  "N":   {row:2, col:2, rhReq:false, ratio:   0.0000},
  "S":   {row:2, col:3, rhReq:false, ratio:   0.0000},
  "s":   {row:2, col:4, rhReq:false, ratio:   0.0000},
  "Lea": {row:2, col:5, rhReq:false, ratio:   0.0000},
  "Leb": {row:2, col:6, rhReq:false, ratio:   0.0000},
  "Jka": {row:2, col:7, rhReq:false, ratio:   0.0000},
  "Jkb": {row:2, col:8, rhReq:false, ratio:   0.0000},
  "P1":  {row:2, col:9, rhReq:false, ratio:   0.0000},
};

class AntigenToggle extends React.Component {
  render() {
    const gridStyle = {
      gridColumn: this.props.col,
      gridRow: this.props.row,
      backgroundColor: this.props.enabled ? "orange" : "white",
      fontWeight: this.props.enabled ? "bold" : "normal",
    };
    return (
      <button className="antToggle" style={gridStyle} onClick={this.props.onClick}>
        {this.props.antigenName}
      </button>
    );
  }
}

class ToggleField extends React.Component {
  render() {
    return (
      <div className="toggle-field">
        {
          Object.keys(antigenStats).map((item, i) => (
            <AntigenToggle
              key={item}
              antigenName={item}
              row={antigenStats[item].row}
              col={antigenStats[item].col}
              enabled={this.props.toggles[item]}
              onClick={() => this.props.onClick(item)}/>
          ))
        }
      </div>
    );
  }
}

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    var antigenStatus = {};
    
    // Setup the antigen true/false statuses based on the hardcoded "dynamic" map of antigens
    for (let antigenShortName in antigenStats) {
      antigenStatus[antigenShortName] = false;
    }
    
    // Store the necessary application state(s)
    this.state = {
      antigenSet: antigenStatus
    };
  }

  handleAntigen(antigen) {
    console.log("Antigen is: " + antigen);
    var tempAntigs = this.state.antigenSet;
    tempAntigs[antigen] = !tempAntigs[antigen];
    this.setState({
      antigenSet: tempAntigs,
    });
  }

  render() {
    return (
      <div className="App">
        <ToggleField toggles={this.state.antigenSet} onClick={(antig) => this.handleAntigen(antig)} />
      </div>
    );
  }
}

export default Calculator;
