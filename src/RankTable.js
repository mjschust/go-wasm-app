import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import SymmetricBundleController from './SymmetricBundleController';

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

/**
 * This component computes the ranks of all bundles of a given lie rank, level, and number of
 * points, and displays the results as a table.
 */
function RankTable() {
  return (
    <SymmetricBundleController computeMethod='computeRanks' render={data => (
      <BootstrapTable
        keyField='weight'
        data={data.map(entry => (
          {
            weight: `[${entry.weight.toString()}]`, 
            rank: entry.rank}
        ))}
        columns={columns}
      />
    )}/>
  );
}

export default RankTable;
