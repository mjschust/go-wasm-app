import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
import createWorker from './create-worker';

const propTypes = {
  /** 
   * Render prop for the data view.  This function will be passed a single parameter
   * 'data' that contains an array of computation results.
   */
  render: PropTypes.func.isRequired,

  /** Go method to call.  See GoWorker.js for options. */
  computeMethod: PropTypes.string.isRequired,
};

/**
 * This component contains the UI controls to select a finite set of symmetric conformal
 * blocks bundles (by setting its lie rank, level and number of points).  Its props 
 * determine which methods is called on the Go backend and the component used to display
 * the results.
 */
class SymmetricBundleController extends Component {
  constructor(props) {
    super(props)

    this.state = {
      dataArray: [],
      rank: 1,
      level: 1,
      numPoints: undefined,
    };

    this.handleRankChange = this.handleRankChange.bind(this);
    this.handleLevelChange = this.handleLevelChange.bind(this);
    this.handlePointsChange = this.handlePointsChange.bind(this);
    this.compute = this.compute.bind(this);
    this.addData = this.addData.bind(this);
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

  /** 
   * Display an error if the number of points has been set to a number less than 3,
   * or set to something other than a number, or set and erased.
   */
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

  /** 
   * The number of points is valid if at least 3. 
   */
  isFormValid() {
    if (!isNaN(this.state.numPoints) && this.state.numPoints >= 3) {
      return true;
    }
    else {
      return false;
    }
  }

  /**
   * Make the Webassembly call given by the prop 'computeMethod'.
   */
  compute() {
    this.setState(state => {
      return {
        dataArray: []
      }
    });
    this.worker.postMessage({
      queryMethod: this.props.computeMethod,
      queryArgs: {
        rank: this.state.rank,
        level: this.state.level,
        numPoints: this.state.numPoints
      }
    });
  }

  /**
   * This callback is triggered when the Webassembly worker has a new entry to add
   * to the list.
   */
  addData(entry) {
    this.setState(state => {
      let newData = state.dataArray.slice();
      newData.push(entry);
      return {
        dataArray: newData
      };
    });
  }

  componentDidMount() {
    // Create the wasm worker
    this.worker = createWorker(this.addData);
  }

  componentWillUnmount() {
    // Kill the wasm worker
    this.worker.terminate();
  }

  render() {
    return (
      <div className='SymmetricBundleController'>
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
                        onClick={this.compute} 
                        disabled={!this.isFormValid()}
                        bsStyle='primary' 
                      >
                        Compute
                      </Button>
                    </ButtonToolbar>
                  </Col>
                </Row>
              </Grid>
            </Panel.Body>
          </Panel>
        </form>
        {this.props.render(this.state.dataArray)}
      </div>
    );
  }
}

SymmetricBundleController.propTypes = propTypes;
export default SymmetricBundleController;
