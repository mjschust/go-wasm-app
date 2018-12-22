import React, { Component } from 'react';
import './App.css';
import DataTable from 'react-data-table-component';

const columns = [
  {
    name: 'Weight',
    selector: 'weight',
    sortable: false
  },
  {
    name: 'Rank',
    selector: 'rank',
    sortable: true
  },
];

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      rankData: []
    };

    this.setRank = this.setRank.bind(this);

    props.worker.onmessage = event => {
      this.setRank(event.data.wt, event.data.rank);
    };
  }

  setRank(wt, rank) {
    this.setState(state => {
      let newRankData = state.rankData.slice();
      newRankData.push({weight: wt.toString(), rank: rank});
      return {
        rankData: newRankData
      };
    });
    this.forceUpdate();
  }

  componentDidMount() {
    this.props.worker.postMessage(this.props.wasmModule);
    // global.goModules.testModule.computeSymmetricRank(
    //   {
    //     rank: 2,
    //     level: 2,
    //     numPoints: 4,
    //     weight: [1, 1]
    //   },
    //   rank => this.setRank([1,1], rank)
    // );
    
    // global.goModules.testModule.computeSymmetricRank(
    //   {
    //     rank: 2,
    //     level: 2,
    //     numPoints: 4,
    //     weight: [0, 1]
    //   },
    //   rank => this.setRank([0,1], rank)
    // );

    // global.goModules.testModule.computeSymmetricRank(
    //   {
    //     rank: 2,
    //     level: 2,
    //     numPoints: 4,
    //     weight: [2, 1]
    //   },
    //   rank => this.setRank([2,1], rank)
    // );

    //global.goModules.testModule.computeRankData(this.setRank);
  }

  render() {
    return (
      <div className="App">
        <DataTable
          noHeader
          columns={columns}
          data={this.state.rankData}
        />
      </div>
    );
  }
}

export default App;