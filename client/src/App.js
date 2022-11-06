import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
// import Mint from './Components/Mint';
import Mint from './Components/Mint';
import Clock from './Components/Clock';
import ConnexionStatus from './Components/ConnexionStatus';
import AccountInfoProvider from './Context/AccountInfo';
import ContractInfoProvider from './Context/ContractInfo';
import DropConfigProvider from './Context/DropConfig.js';
import Connect from './Components/Connect';
import {Routes,Route} from "react-router-dom";
import './App.css'

function App() {
  return (
    <DropConfigProvider>
        <AccountInfoProvider>
          <ContractInfoProvider>
              <div style={{backgroundColor: "#eeeeee"}}className="background d-flex align-items-center justify-content-center">
                <div className="App d-flex align-items-center justify-content-center">
                  <Container>
                      <Row id='App_row' className="d-flex align-items-center justify-content-center">
                        <Col className="d-flex align-items-center justify-content-center">
                          <Routes>
                            <Route path="/" element={<Mint/>}/>
                            <Route path="/clocks/:clockId" element={<Clock/>}/>
                          </Routes>
                        </Col>
                      </Row>
                      <Row>
                        <Col className='small_font'>
                          <Connect/>
                          <ConnexionStatus/>
                        </Col>
                      </Row>
                  </Container>
                </div>
              </div>
          </ContractInfoProvider>
        </AccountInfoProvider>
      </DropConfigProvider>
  );
}

export default App;