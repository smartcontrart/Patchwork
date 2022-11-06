import React, {useState, useEffect, useContext} from "react";
import {Container, Row, Col, Button, Spinner, Alert, Form} from 'react-bootstrap'
import { AccountInfoContext } from "../Context/AccountInfo";
import { SliderPicker, CompactPicker, SketchPicker } from 'react-color

import '../App.css'

function Mint() {
    let accountInfo = useContext(AccountInfoContext)

    const [size, setSize] = useState(5)
    const [shapes, setShapes] = useState('')
    const [colors, setColors] = useState('')
    const [borders, setBorders] = useState('')
    const [borderColors, setBorderColors] = useState('')
    const [selection, setSelection] = useState({shape: 'c', color: '000000', border: 'y', borderColor: 'ffffff'})
    const [backgroundColorPicker, setBackgroundColorPicker] = useState('blue');
    const [colorTarget, setColorTarget] = useState('shape')
    const [targetShapeColor, setTargetShapeColor] = useState('000000')
    const [targetBorderColor, setTargetBorderColor] = useState('ffffff')

    useEffect(() => {
        initializeData()
      }, []);

    function initializeData(){
        let shapesInit = '';
        let colorsInit = '';
        let bordersInit = '';
        let borderColorsInit = '';
        for(let i=0; i<size*size; i++){
            console.log(i)
            shapesInit += 's'
            colorsInit += 'ffffff'
            bordersInit += 'y'
            borderColorsInit += '000000'
        }
        console.log(shapesInit)
        setShapes(shapesInit)
        setColors(colorsInit)
        setBorders(bordersInit)
        setBorderColors(borderColorsInit)
    }

    function randomize(){
        let shapesInit = '';
        let colorsInit = '';
        let bordersInit = '';
        let borderColorsInit = '';
        let hexValues = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f']
        for(let i=0; i<size*size; i++){
            console.log(i)
            shapesInit += getRandomInt(2) === 0 ? 's' : 'c'
            bordersInit += getRandomInt(2) === 0 ? 'y' : 'n'
            for(let j=0; j<6; j++){
                colorsInit += hexValues[getRandomInt(16)]
                borderColorsInit += hexValues[getRandomInt(16)]
            }
        }
        console.log(shapesInit)
        setShapes(shapesInit)
        setColors(colorsInit)
        setBorders(bordersInit)
        setBorderColors(borderColorsInit)
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
      }

    function handleClick(x, y){
        let start = (x + y * size)
        let end = start
        let newShapes = shapes.substring(0, start) + selection.shape + shapes.substring(end + 1, shapes.length)
        let newColors = colors.substring(0, start * 6) + selection.color + colors.substring(end * 6 + 6, colors.length)
        let newBorders = borders.substring(0, start) + selection.border + borders.substring(end + 1, borders.length)
        let newBorderColors = borderColors.substring(0, start * 6) + selection.borderColor + borderColors.substring(end * 6 + 6, borderColors.length)
        setShapes(newShapes)
        setColors(newColors)
        setBorders(newBorders)
        setBorderColors(newBorderColors)
        console.log(newShapes)
        console.log(newColors)
        console.log(newBorders)
        console.log(newBorderColors)
    }

    function getInfo(string, x, y, length){
        let start = (x + y * size)*length
        let end = start + length
        return string.substring(start, end)
    }

    function renderShapes(){
        let result = []
            for(let i = 0; i < size; i++){
                for(let j = 0; j < size; j++){
                    let shape = getInfo(shapes, i, j, 1)
                    let color = getInfo(colors, i, j, 6)
                    let border = getInfo(borders, i, j, 1)
                    let borderColor = getInfo(borderColors, i, j, 6)
                    let strokeWidth = border === 'y' ? '0.02' : '0'
                    if (shape === 'c'){
                        result.push(
                            <circle 
                                cx={i + 0.5}
                                cy={j + 0.5}
                                r={0.49}
                                fill={`#${color}`}
                                stroke={`#${borderColor}`} 
                                stroke-width={strokeWidth} 
                                onClick={()=>handleClick(i,j)}
                            />
                        )
                    }else{
                        result.push (
                            <rect xmlns="http://www.w3.org/2000/svg" 
                                x={i + 0.01} 
                                y={j + 0.01} 
                                width={0.98} 
                                height={0.98} 
                                fill={`#${color}`} 
                                stroke={`#${borderColor}`} 
                                stroke-width={strokeWidth} 
                                onClick={()=>handleClick(i,j)}
                            />)
                    }
                }
            }
        return result;
    }

    function renderSVG(){
        return(
            <Col xs={12} className='d-flex justify-content-center align-items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${size} ${size}`} width='350px' height='350px'>
                    {renderShapes(size)}
                </svg>
            </Col>
        )
    }

    function makeAllSquares(){
        let result = ''
        let shapeColor = ''
        for(let i =0; i< size*size; i++){
            result += 's';
            shapeColor += targetShapeColor
        }
        setShapes(result);
        setColors(shapeColor)
    }

    function makeAllCircles(){
        let result = ''
        let shapeColor = ''
        for(let i =0; i< size*size; i++){
            result += 'c';
            shapeColor += targetShapeColor
        }
        console.log()
        setShapes(result);
        setColors(shapeColor)
    }

    function makeAllBorders(){
        let hasBorders = ''
        let bordersColor = ''
        for(let i =0; i< size*size; i++){
            hasBorders += 'y';
            bordersColor += targetBorderColor
        }
        setBorders(hasBorders)
        setBorderColors(bordersColor)
    }

    function makeNoBorders(){
        let result = ''
        for(let i =0; i< size*size; i++){
            result += 'n';
        }
        setBorders(result)
    }

    function renderChangeAllButtons(){
        return(
            <React.Fragment>
            <Row className="mb-2">
                <Col className="justify-content-center align-items-center" xs={12} lg={6}>
                    <Button className='mx-2' variant='outline-dark' style={{width: '120px'}} onClick={makeAllSquares}>
                        All squares
                    </Button>
                </Col>
                <Col className="justify-content-center align-items-center" xs={12} lg={6}>
                    <Button className='mx-2' variant='outline-dark' style={{width: '120px'}} onClick={makeAllCircles}>
                        All circles
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col className="justify-content-center align-items-center" xs={12} lg={6}>
                    <Button className='mx-2' variant='outline-dark' style={{width: '120px'}} onClick={makeAllBorders}>
                        All borders
                    </Button>
                </Col>
                <Col className="justify-content-center align-items-center" xs={12} lg={6}>
                    <Button className='mx-2' variant='outline-dark' style={{width: '120px'}} onClick={makeNoBorders}>
                        No borders
                    </Button>
                </Col>
            </Row>
            </React.Fragment>
        )
    }

    function renderSuggestionButtons(){
        return(
            <React.Fragment>
            <Row className="my-2">
                <Col className="justify-content-center align-items-center button_3" xs={12} lg={4}>
                    <Button className='mx-2 button_3' variant='outline-dark' onClick={initializeData}>
                        Reset
                    </Button>
                </Col>
                <Col className="justify-content-center align-items-center button_3" xs={12} lg={4}>
                    <Button className='mx-2 button_3' variant='outline-dark'  onClick={randomize}>
                        Random
                    </Button>
                </Col>
                <Col className="justify-content-center align-items-center button_3" xs={12} lg={4}>
                    <Button className='mx-2 button_3' variant='outline-dark'  onClick={initializeData}>
                        Suggested
                    </Button>
                </Col>
            </Row>

            </React.Fragment>
        )
    }

    function changeShape(shape){
        setSelection({
            ...selection,
            shape: shape
          });
    }

    function changeBorder(border){
        setSelection({
            ...selection,
            border: border
          });
    }


    function renderShapeCustomization(){
        return(
            <React.Fragment>
                <Col className="justify-content-center align-items-center" xs={12}>
                    Shape Selection
                </Col>
                    <Col className="justify-content-center align-items-center" xs={6}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 1 1`} width='50' height='50' onClick={() => changeShape('s')}>
                        <rect xmlns="http://www.w3.org/2000/svg" 
                            x={0.025} 
                            y={0.025} 
                            width={0.95} 
                            height={0.95} 
                            fill={`#${selection.color}`}
                            stroke={(selection.color[0].toLowerCase() === 'f' || selection.color[0].toLowerCase()=== 'e') ? '#000' : '#fff'} 
                            stroke-width={selection.shape === 's' ? '0.075' : '0'} 
                            />
                        </svg>
                    </Col>
                    <Col className="justify-content-center align-items-center" xs={6}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 1 1`} width='50' height='50' onClick={() => changeShape('c')}>
                            <circle 
                                cx={0.5}
                                cy={0.5}
                                r={0.475}
                                fill={`#${selection.color}`}
                                stroke={(selection.color[0].toLowerCase() === 'f' || selection.color[0].toLowerCase()=== 'e') ? '#000' : '#fff'} 
                                stroke-width={selection.shape === 'c' ? '0.075' : '0'} 
                            />
                        </svg>
                    </Col>
            </React.Fragment>
        )
    }

    function renderBorderCustomization(){
        return(
            <React.Fragment>
                <Col className="justify-content-center align-items-center" xs={12}>
                    Border Selection
                </Col>
                <Col className="justify-content-center align-items-center" xs={6}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 1 1`} width='50' height='50' onClick={() => changeBorder('y')}>
                        <rect xmlns="http://www.w3.org/2000/svg" 
                            x={0.025} 
                            y={0.025} 
                            width={0.95} 
                            height={0.95} 
                            fill={`rgb(255,255,255,10)`}
                            fill-opacity="0"
                            stroke={`#${selection.borderColor}`} 
                            stroke-width={selection.border === 'y' ? '0.15' : '0.02'} 
                            />
                    </svg>
                </Col>
                <Col className="justify-content-center align-items-center" xs={6}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 1 1`} width='50' height='50' onClick={() => changeBorder('n')}>
                        <rect xmlns="http://www.w3.org/2000/svg" 
                            x={0.025} 
                            y={0.025} 
                            width={0.95} 
                            height={0.95} 
                            fill={`rgb(255,255,255,10)`}
                            fill-opacity="0"
                            stroke={`#333333`} 
                            stroke-width={selection.border === 'n' ? '0.1' : '0.02'}
                            stroke-dasharray={"0.05,0.05,0.05,0.05"}
                        />
                    </svg>
                </Col>
            </React.Fragment>
        )
    }

    function selectColorTarget(target){
        setColorTarget(target)
    }

    function renderColorCustomization(){
        return(
            <React.Fragment>
                <Col className="justify-content-center align-items-center" xs={12}>
                    Color Selection
                </Col>
                <Col className="justify-content-center align-items-center" xs={6}>
                    <Button variant={colorTarget === 'shape' ? 'dark' : 'outline-dark'} onClick={()=>selectColorTarget('shape')}>
                        Shape
                    </Button>
                </Col>
                <Col className="justify-content-center align-items-center" xs={6}>
                    <Button variant={colorTarget === 'border' ? 'dark' : 'outline-dark'} onClick={()=>selectColorTarget('border')}>
                        Border
                    </Button>
                </Col>
            </React.Fragment>
        )
    }

    function renderShape(){
        let strokeWidth = selection.border === 'y' ? 0.02 : 0
        console.log(selection)
        if (selection.shape  === 'c'){
            return(
                <circle 
                    cx={0.5}
                    cy={0.5}
                    r={0.49}
                    fill={`#${selection.color}`}
                    stroke={`#${selection.borderColor}`} 
                    stroke-width={strokeWidth} 
                />
            )
        }else{
            return(
                <rect xmlns="http://www.w3.org/2000/svg" 
                    x={0.025} 
                    y={0.025} 
                    width={0.95} 
                    height={0.95} 
                    fill={`#${selection.color}`} 
                    stroke={`#${selection.borderColor}`} 
                    stroke-width={strokeWidth} 
                />
            )
        }
    }

    function renderWitnessShape(){
        return(
            <Col xs={12}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 1 1`} width='50' height='50'>
                    {renderShape()}
                </svg>
            </Col>
        )
    }

    function renderCustomization(){
        return(
            <React.Fragment>

                <Row className="mb-2 justify-content-center align-items-center">
                    <Col xs={12}>
                        <Row className="mb-2">
                            {renderShapeCustomization()}
                        </Row>
                        <Row className="mb-2">
                            {renderBorderCustomization()}
                        </Row>
                        <Row className="mb-2">
                            {renderColorCustomization()}
                        </Row>
                    </Col>
                </Row>
                <Row className="mb-2 justify-content-center align-items-center">
                    <Col xs={12} className=' justify-content-center align-items-center'>
                        <CompactPicker 
                            color={backgroundColorPicker} 
                            onChange={handleColorChange}
                        />
                    </Col>
                </Row>
            </React.Fragment>
        )
    }

    function renderUI(){
        return(
            <Container>
                {renderCustomization()}
                {renderChangeAllButtons()}
                {renderSuggestionButtons()}
            </Container>
        )
    }

    function handleColorChange(color){
        let colorValue = color.hex.replace('#','')
        setBackgroundColorPicker(color)
        setTargetBorderColor(colorValue)
        if(colorTarget === 'shape'){
            setTargetShapeColor(colorValue)
            setSelection({
                ...selection,
                color: colorValue
            });
        }else{
            setTargetBorderColor(colorValue)
            setSelection({
                ...selection,
                borderColor: colorValue
            });
        }
    }

    return ( 
        <Container>
            <Row>
                <Col className="d-flex justify-content-center align-items-center" md={6}>
                    <Container fluid>
                        <Row className="justify-content-center align-items-center mb-3">
                            {renderSVG()}
                        </Row>
                        <Row className="d-flex justify-content-center align-items-center">
                            {renderWitnessShape()}
                        </Row>
                    </Container>
                </Col>
                <Col md={4} className="justify-content-center align-items-center">
                    {renderUI()}
                </Col>
            </Row>
        </Container>
     );
}

export default Mint;


