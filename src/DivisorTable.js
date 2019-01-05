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
  {
    dataField: 'divisor',
    text: 'Divisor',
  },
];

/**
 * This component computes the ranks of all bundles of a given lie rank, level, and number of
 * points, and displays the results as a table.
 */
function DivisorTable() {
  return (
    <SymmetricBundleController computeMethod='computeDivisors' render={data => (
      <BootstrapTable
        keyField='weight'
        data={data.map(entry => (
          {
            weight: `[${entry.weight.toString()}]`, 
            rank: entry.rank,
            divisor: `[${entry.divisor.toString()}]`
          }
        ))}
        columns={columns}
      />
    )}/>
  );
}

export default DivisorTable;
