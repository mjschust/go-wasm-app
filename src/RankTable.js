import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import React, { Component } from 'react';
import { 
  Grid,
  Row,
  Col,
  Panel,
  Button,
  ButtonToolbar,
  FormGroup,
  FormControl,
  ControlLabel
} from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import createWorker from './create-worker';
import runWasm from './run-wasm';

const columns = [
  {
    dataField: 'weight',
    text: 'Weight',
  },
  {
    dataField: 'rank',
    text: 'Rank',
    sort: true
  },
];

class RankTable extends Component {
  constructor(props) {
    super(props)

    this.state = {
      rankData: [],
      rank: 1,
      level: 1,
      numPoints: undefined,
    };

    this.moduleLoaded = this.moduleLoaded.bind(this);
    this.handleRankChange = this.handleRankChange.bind(this);
    this.handleLevelChange = this.handleLevelChange.bind(this);
    this.handlePointsChange = this.handlePointsChange.bind(this);
    this.addRank = this.addRank.bind(this);
    this.computeRanks = this.computeRanks.bind(this);
    this.computeRanksSync = this.computeRanksSync.bind(this);
  }

  moduleLoaded() {
    // TODO: enable compute button(s) here
  }

  handleRankChange(e) {
    this.setState({ rank: parseInt(e.target.value, 10) })
  }

  handleLevelChange(e) {
    this.setState({ level: parseInt(e.target.value, 10) })
  }

  handlePointsChange(e) {
    this.setState({ numPoints: parseInt(e.target.value, 10) })
  }

  getPointsValidationState() {
    if (!isNaN(this.state.numPoints) && this.state.numPoints >= 3) {
      return null;
    }
    else if (this.state.numPoints === undefined) {
      return null;
    }
    else {
      return 'error';
    }
  }

  isFormValid() {
    if (!isNaN(this.state.numPoints) && this.state.numPoints >= 3) {
      return true;
    }
    else {
      return false;
    }
  }

  addRank({ wt, rank }) {
    this.setState(state => {
      let newRankData = state.rankData.slice();
      newRankData.push({weight: wt.toString(), rank: rank});
      return {
        rankData: newRankData
      };
    });
  }

  computeRanks() {
    this.setState(state => {
      return {
        rankData: []
      }
    });
    this.worker.postMessage({
      queryMethod: 'computeRanks',
      queryArgs: {
        rank: this.state.rank,
        level: this.state.level,
        numPoints: this.state.numPoints
      }
    });
  }

  computeRanksSync() {
    this.setState(state => {
      return {
        rankData: []
      }
    });
    global.goModules.testModule.computeRankData(
      {
        rank: this.state.rank,
        level: this.state.level,
        numPoints: this.state.numPoints
      },
      (wt, rank) => {
        this.addRank({wt, rank});
      });
  }

  componentDidMount() {
    this.worker = createWorker({
      moduleLoaded: this.moduleLoaded,
      addRank: this.addRank
    });
    runWasm();
  }

  componentWillUnmount() {
    this.worker.terminate();
  }

  render() {
    return (
      <div className='RankTable'>
        <form>
          <Panel>
            <Panel.Body>
              <Grid>
                <Row>
                  <Col md={2}>
                    <FormGroup controlId="rankSelect">
                      <ControlLabel>Lie group rank</ControlLabel>
                      <FormControl componentClass="select" onChange={this.handleRankChange}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                      </FormControl>
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup controlId="levelSelect">
                      <ControlLabel>Level</ControlLabel>
                      <FormControl componentClass="select" onChange={this.handleLevelChange}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                      </FormControl>
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup 
                      controlId="pointsInput" 
                      validationState={this.getPointsValidationState()} 
                    >
                      <ControlLabel>Number of points</ControlLabel>
                      <FormControl placeholder={"n \u2265 3"} onChange={this.handlePointsChange}/>
                      <FormControl.Feedback />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <ButtonToolbar >
                      <Button 
                        onClick={this.computeRanks} 
                        disabled={!this.isFormValid()}
                        bsStyle='primary' 
                      >
                        Compute Ranks
                      </Button>
                      <Button 
                        onClick={this.computeRanksSync} 
                        disabled={!this.isFormValid()}
                        bsStyle='primary' 
                      >
                        Sync Compute Ranks
                      </Button>
                    </ButtonToolbar>
                  </Col>
                </Row>
              </Grid>
            </Panel.Body>
          </Panel>
        </form>
        <BootstrapTable
          keyField='weight'
          data={this.state.rankData}
          columns={columns}
        />
      </div>
    );
  }
}

export default RankTable;
