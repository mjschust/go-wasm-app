import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import React, { Component } from 'react';
import { 
  Navbar,
  Nav,
  NavItem,
  PageHeader,
  Grid,
  Row,
  Col,
} from 'react-bootstrap';
import RankTable from './RankTable';

function App() {
  return (
    <div className='App'>
      <Navbar inverse staticTop>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="./">Conformal Blocks</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <NavItem href="https://github.com/mjschust/go-wasm-app">GitHub</NavItem>
        </Nav>
      </Navbar>
      <Grid>
        <Row>
          <Col md={3}>
            <div style={{paddingLeft: "20px", fontSize: "16.8px"}}>
              <Nav stacked bsSize="large">
                <NavItem>Ranks</NavItem>
                <NavItem>Divisors</NavItem>
                <NavItem>F-curves</NavItem>
              </Nav>
            </div>
          </Col>
          <Col md={9}>
            <PageHeader>Conformal blocks ranks</PageHeader>
            <RankTable/>
          </Col>
        </Row>
      </Grid>
      
    </div>
  );
}

export default App;
