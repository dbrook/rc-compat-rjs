import React from 'react';
import './App.css';

// PrimeReact Widget Import
import {Panel} from 'primereact/panel';
import {Card} from 'primereact/card';
import {ToggleButton} from 'primereact/togglebutton';
import {SelectButton} from 'primereact/selectbutton';
import {InputNumber} from 'primereact/inputnumber';

// PrimeReact Theme Import
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

const antigenStats = {
  "C":   {row:1, col:1, rhReq:true,  rhPosRat:0.17,   rhNegRat:0.97},
  "c":   {row:1, col:2, rhReq:true,  rhPosRat:0.19,   rhNegRat:0.0002},
  "E":   {row:1, col:3, rhReq:true,  rhPosRat:0.57,   rhNegRat:0.97},
  "e":   {row:1, col:4, rhReq:true,  rhPosRat:0.02,   rhNegRat:0.0002},
  "K":   {row:1, col:5, rhReq:false, ratio:   0.91  },
  "k":   {row:1, col:6, rhReq:false, ratio:   0.0002},
  "Fya": {row:1, col:7, rhReq:false, ratio:   0.34  },
  "Fyb": {row:1, col:8, rhReq:false, ratio:   0.17  },
  "M":   {row:2, col:1, rhReq:false, ratio:   0.22  },
  "N":   {row:2, col:2, rhReq:false, ratio:   0.28  },
  "S":   {row:2, col:3, rhReq:false, ratio:   0.45  },
  "s":   {row:2, col:4, rhReq:false, ratio:   0.11  },
  "Lea": {row:2, col:5, rhReq:false, ratio:   0.78  },
  "Leb": {row:2, col:6, rhReq:false, ratio:   0.27  },
  "Jka": {row:2, col:7, rhReq:false, ratio:   0.23  },
  "Jkb": {row:2, col:8, rhReq:false, ratio:   0.28  },
  "P1":  {row:2, col:9, rhReq:false, ratio:   0.21  },
};

const rhSelectItems = [
  {label: 'Positive', value:  1},
  {label: 'Negative', value: -1},
];

function rhesusSpecificRatioNeeded(antigenSelections) {
  for (let antigName in antigenStats) {
    if (antigenStats[antigName].rhReq && antigenSelections[antigName]) {
      return true;
    }
  }
  return false;
}

function computeAntigenStatistic(antigenSelections, rhesusFactor, multiplier) {
  var result = 1.0;
  for (let antigName in antigenStats) {
    if (antigenSelections[antigName]) {
      if (antigenStats[antigName].rhReq) {
        if (rhesusFactor < 0) {
          // Negative
          result *= antigenStats[antigName].rhNegRat;
        } else if (rhesusFactor > 0) {
          // Positive
          result *= antigenStats[antigName].rhPosRat;
        } else {
          // Rhesus Factor required to accurately compute ratio
          return "Set Rh Factor";
        }
      } else {
        result *= antigenStats[antigName].ratio;
      }
    }
  }
  return "Units to screen: " + (multiplier / result).toFixed(2);
}

function AntigenToggle(props) {
  const gridStyle = {
    width: "3em",
  };
  return (
    <ToggleButton
      className="p-m-1 p-col-fixed"
      style={gridStyle}
      offLabel={props.antigenName}
      onLabel={props.antigenName}
      checked={props.enabled}
      onChange={props.onClick}
    />
  );
}

function ToggleField(props) {
  return (
    <Panel className="p-m-2 p-shadow-4" header="Antigen Selection">
      {
        Object.keys(antigenStats).map((item, i) => (
          <AntigenToggle
            key={item}
            antigenName={item}
            row={antigenStats[item].row}
            col={antigenStats[item].col}
            enabled={props.toggles[item]}
            onClick={() => props.onClick(item)}/>
        ))
      }
    </Panel>
  );
}

function RhesusSelector(props) {
  return (
    <Panel className="p-m-2 p-shadow-4" header="Rhesus Factor">
      <SelectButton
        value={props.rhFac}
        options={rhSelectItems}
        disabled={!props.rhNeeded}
        onChange={(ev) => props.onClick(ev.value)}
      ></SelectButton>
    </Panel>
  );
}

function UnitMultiplier(props) {
  return (
    <Panel className="p-m-2 p-shadow-4" header="Desired units">
      <InputNumber
        value={props.nbUnitsDesired}
        onValueChange={props.onChange}
        className="multi-input"
        min={1}
        showButtons
        buttonLayout="horizontal"
        decrementButtonClassName="p-button-danger"
        incrementButtonClassName="p-button-success"
        incrementButtonIcon="pi pi-plus"
        decrementButtonIcon="pi pi-minus" 
      />
    </Panel>
  );
}

function OutputZone(props) {
  return (
    <Card className="p-m-2 p-shadow-4">{props.outputText}</Card>
  );
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
      antigenSet: antigenStatus,
      rhesusReq: false,
      rhesusFac: 0,
      desiredUnits: 1,
      resultOutput: "Units to screen: 1.00",
    };
  }

  handleAntigenSelect(antigen) {
    // Update the antigenSet grid based on the new selection
    var tempAntigs = this.state.antigenSet;
    tempAntigs[antigen] = !tempAntigs[antigen];

    // Perform the calculation for display
    var compResult = computeAntigenStatistic(tempAntigs, this.state.rhesusFac, this.state.desiredUnits);

    // Save the changes and results
    this.setState({
      antigenSet: tempAntigs,
      rhesusReq: rhesusSpecificRatioNeeded(tempAntigs),
      resultOutput: compResult,
    });
  }

  handleRhChange(factor) {
    // Unset the selection if the same value requested again
    if (factor === this.state.rhesusFac) {
      factor = 0;
    }

    // Perform the calculation for display
    var compResult = computeAntigenStatistic(this.state.antigenSet, factor, this.state.desiredUnits);

    this.setState({
      rhesusFac: factor,
      resultOutput: compResult,
    });
  }

  handleMultiplierChange(event) {
    // Perform the calculation for display
    var compResult = computeAntigenStatistic(this.state.antigenSet, this.state.rhesusFac, event.target.value);

    this.setState({
      desiredUnits: event.target.value,
      resultOutput: compResult,
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>RCcompat5 (React Version)</h1>
        </div>
        <ToggleField
          toggles={this.state.antigenSet}
          onClick={(antig) => this.handleAntigenSelect(antig)}
        />
        <RhesusSelector
          rhFac={this.state.rhesusFac}
          rhNeeded={this.state.rhesusReq}
          onClick={(fac) => this.handleRhChange(fac)}
        />
        <UnitMultiplier
          nbUnitsDesired={this.state.desiredUnits}
          onChange={(event) => this.handleMultiplierChange(event)}
        />
        <OutputZone
          outputText={this.state.resultOutput}
        />
      </div>
    );
  }
}

export default Calculator;
