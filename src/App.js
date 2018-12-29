import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';

const columns = [
  {
    dataField: 'weight',
    text: 'Weight',
  },
  {
    dataField: 'rank',
    text: 'Rank',
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
  }

  render() {
    return (
      <div className="App">
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
