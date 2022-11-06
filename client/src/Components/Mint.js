import React, {useState, useContext} from "react";
import {Container, Row, Col, Button, Spinner, Alert, Form} from 'react-bootstrap'
import { AccountInfoContext } from "../Context/AccountInfo";
import { useNavigate } from "react-router-dom";
import Grid from "./Grid.js"
import website_logo from '../images/website_logo.png'
import header from '../images/header.png'

import '../App.css'

function Mint() {
    let accountInfo = useContext(AccountInfoContext)

    const [clockId, setClockId] = useState(0)

    const choices = ['Clock Mode', 'Chrono Mode', 'Timer Mode', 'Alarm Mode']

    const [alert, setAlert] = useState({active: false, content: null, variant: null})

    async function handleMint(){
        let price = accountInfo.mintPrice
        accountInfo.updateAccountInfo({userFeedback: `Minting an clock for ${price/10**18} ETH...`})
        try{
            await accountInfo.ClockMintInstance.methods.publicMint(
                    ).send({from: accountInfo.account, value: price});
            displayAlert('Mint successful!', 'success')
        }catch(error){
            displayAlert(error.message, 'warning')
        }
    }

    function displayAlert( message, variant){
        setAlert({active: true, content: message, variant: variant})
        setTimeout(function() { setAlert({active: false, content: null, variant: null}); }, 10000);
    }


    function renderMintButton(){
        if(!window.ethereum || !accountInfo.account){
            return null
        }else{
            return(
                <Row>
                    <Col className="d-flex align-items-center justify-content-center m-2">
                        <Button variant='warning' style={{maxWidth: '100px'}} className='mx-2' onClick={()=>handleMint()}>Mint</Button>
                    </Col>
                    
                </Row>
            )
        }
    }

    function renderUserInterface(){

        if(!window.ethereum || !accountInfo.account){
            return <div className="m-5" style={{fontSize:'20px'}}> <b>Please ensure you have a wallet before accessing this website</b></div>
        }else{
            return(
                <Container>
                    {renderMintButton()}
                </Container>
            )
        }
    }

    function renderUserFeedback(){
        if(accountInfo.userFeedback){
            return(
                <React.Fragment>
                    <div>
                        <Spinner animation="grow" variant="light"/>
                    </div>
                    <div>{accountInfo.userFeedback}</div>
                </React.Fragment>
            )
        }
    }

    function renderAlert(){
        if(alert.active){
            return(
            <Col className='m-3'>
                <br/><br/>
                <Alert variant={alert.variant}>{alert.content}</Alert>
            </Col>
            )
        }

    }

    return ( 
        <Container>
            <div className='blackOverlay'> </div>
            <Row className="mb-5">
                <a className='my-3' style={{ textDecoration: 'none', color: 'white' }} href={`/`}>
                    <img id='header_picture'
                        src={header}
                    />
                </a>
                <div><big>Create your patch and contribute to the patchwork</big></div>
                <div><big>A collaborative art project, 100% onchain</big></div>
            </Row>
            <Grid/>
            <Row>
                {renderUserInterface()}
            </Row>
            <Row className='m-3'>
                {renderUserFeedback()}
            </Row>
            <Row className="Home_row"> 
                {renderAlert()}
            </Row>
        </Container>
     );
}

export default Mint;


