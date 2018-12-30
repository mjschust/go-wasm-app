import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import React, { Component } from 'react';
import { PageHeader, Button, ButtonToolbar } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import createWorker from './create-worker';

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

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      rankData: []
    };

    this.moduleLoaded = this.moduleLoaded.bind(this);
    this.addRank = this.addRank.bind(this);
    this.computeRanks = this.computeRanks.bind(this);
  }

  moduleLoaded() {
    // TODO: enable compute button(s) here
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
      queryMethod: 'computeRanks'
    });
  }

  componentDidMount() {
    this.worker = createWorker({
      moduleLoaded: this.moduleLoaded,
      addRank: this.addRank
    });
  }

  componentWillUnmount() {
    this.worker.terminate();
  }

  render() {
    return (
      <div className="App">
        <PageHeader>Conformal blocks in the browser</PageHeader>
        <ButtonToolbar>
          <Button onClick={this.computeRanks} bsStyle="primary" >Compute Ranks</Button>
        </ButtonToolbar>
        <BootstrapTable
          keyField='weight'
          data={this.state.rankData}
          columns={columns}
        />
      </div>
    );
  }
}

export default App;
