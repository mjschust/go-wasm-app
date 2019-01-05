import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import React from 'react';
import { 
  Navbar,
  Nav,
  NavItem,
  PageHeader,
  Grid,
  Row,
  Col,
} from 'react-bootstrap';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
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
      <Router>
      <Grid>
        <Row>
          <Col md={3}>
            <div style={{paddingLeft: "20px", fontSize: "16.8px"}}>
              <Nav stacked bsSize="large">
                <LinkContainer to="/">
                  <NavItem>Ranks</NavItem>
                </LinkContainer>
                <LinkContainer to="/divisors">
                  <NavItem>Divisors</NavItem>
                </LinkContainer>
                <LinkContainer to="/fcurves">
                  <NavItem>F-curves</NavItem>
                </LinkContainer>
              </Nav>
            </div>
          </Col>
          <Col md={9}>
            <Route exact path="/" render={() => (
              <div>
                <PageHeader>Conformal blocks ranks</PageHeader>
                <RankTable/>
              </div>
            )}/>
            <Route path="/divisors" render={() => (
              <div>
                <PageHeader>Conformal blocks divisors</PageHeader>
                <RankTable/>
              </div>
            )}/>
            <Route path="/fcurves" render={() => (
              <div>
                <PageHeader>Intersections with F-curves</PageHeader>
                TODO...
              </div>
            )}/>
          </Col>
        </Row>
      </Grid>
      </Router>
      
    </div>
  );
}

export default App;
