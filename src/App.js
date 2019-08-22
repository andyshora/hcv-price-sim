import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import styled from 'styled-components'
import ContainerDimensions from 'react-container-dimensions'

import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Slider from '@material-ui/core/Slider'

import CostBreakdown from './components/cost-breakdown'
import CuredMeter from './components/cured-meter'
import SimGraph from './components/sim-graph'

// function VerticalThumbComponent() {
//   return <ThumbWrap />
// }

const GridWrap = styled.div`
  width: 100%;
  display: grid;
  margin: 100px auto 0;
  grid-template-areas:
    't t'
    'v c'
    '. h';
  grid-template-rows: 80px 1fr 50px;
  grid-template-columns: 50px 1fr;
`
const Header = styled.div`
  grid-area: t;
`
const VerticalControls = styled.div`
  grid-area: v;
  display: flex;
  flex-align: center;
  justify-content: center;
`
const HorizontalControls = styled.div`
  grid-area: h;
  display: flex;
  flex-direction: column;
  flex-align: center;
  justify-content: center;
`

const GraphWrap = styled.div`
  grid-area: c;
  width: 100%;
  min-height: 600px;
`

const graphMargin = { top: 80, left: 80, right: 80, bottom: 80 }

function VerticalSlider({ onChange, height = 300, defaultValue = 1 }) {
  return (
    <Slider
      orientation="vertical"
      valueLabelFormat={v => `$${v}`}
      valueLabelDisplay="auto"
      onChange={onChange}
      min={0}
      max={1}
      step={0.01}
      defaultValue={defaultValue}
      style={{ margin: 'auto', height: `${height}px` }}
    />
  )
}

function HorizontalSlider({ onChange, width = 300, defaultValue = 1 }) {
  return (
    <Slider
      orientation="horizontal"
      valueLabelFormat={v => `$${v}`}
      valueLabelDisplay="auto"
      onChange={onChange}
      min={0}
      max={1}
      step={0.01}
      defaultValue={defaultValue}
      style={{ margin: 'auto', width: `${width}px` }}
    />
  )
}

export default function App() {
  const [xPerc, setXPerc] = useState(1)
  const [yPerc, setYPerc] = useState(0)
  return (
    <Container maxWidth="lg">
      <GridWrap>
        <Header>
          <Typography variant="h2" component="h1" gutterBottom>
            HCV Price Simulator
          </Typography>
          <p>
            x: {xPerc}%, y: {yPerc}%
          </p>
        </Header>
        <VerticalControls>
          <ContainerDimensions>
            {({ width, height }) => (
              <VerticalSlider
                height={height - (graphMargin.top + graphMargin.bottom)}
                onChange={(e, val) => {
                  setYPerc(val)
                }}
                defaultValue={yPerc}
              />
            )}
          </ContainerDimensions>
        </VerticalControls>
        <HorizontalControls>
          <ContainerDimensions>
            {({ width, height }) => (
              <HorizontalSlider
                width={width - (graphMargin.left + graphMargin.right)}
                onChange={(e, val) => {
                  setXPerc(val)
                }}
                defaultValue={xPerc}
              />
            )}
          </ContainerDimensions>
        </HorizontalControls>
        <GraphWrap>
          <ContainerDimensions>
            {({ width, height }) => (
              <SimGraph
                highlightDimensions={{ x: xPerc, y: yPerc }}
                height={height}
                width={width}
                margin={graphMargin}
                highlightLabel={!!yPerc ? `$${yPerc}` : null}
              />
            )}
          </ContainerDimensions>
        </GraphWrap>
      </GridWrap>
    </Container>
  )
}
