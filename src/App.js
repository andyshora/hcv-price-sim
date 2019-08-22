import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import styled from 'styled-components'
import ContainerDimensions from 'react-container-dimensions'
import _ from 'lodash'

import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Slider from '@material-ui/core/Slider'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ViewColumnIcon from '@material-ui/icons/ViewColumn'
import VerticalAlignCenterIcon from '@material-ui/icons/VerticalAlignCenter'
import CropIcon from '@material-ui/icons/Crop'

import CostBreakdown from './components/cost-breakdown'
import CuredMeter from './components/cured-meter'
import SimGraph from './components/sim-graph'
import { VerticalSlider, HorizontalSlider } from './components/sliders'

import theme from './theme'

// data
import patientData from './data/data.json'
import bounds from './data/bounds.json'

// function VerticalThumbComponent() {
//   return <ThumbWrap />
// }

const GridWrap = styled.div`
  width: 100%;
  display: grid;
  position: relative;
  margin: 50px auto 0;
  grid-template-areas:
    't t'
    'v c'
    '. h';
  grid-template-rows: 120px 1fr 50px;
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

const BreakdownWrap = styled.div`
  width: 50%;
  height: 400px;
  position: absolute;
  right: 0;
  top: 0;
  opacity: 0.5;
`

const ViewNav = styled.nav`
  position: relative;
  z-index: 20;
`

const LineLabel = styled.label`
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: baseline;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);

  > label {
    font-size: 1.2rem;
    text-transform: uppercase;
    margin: 0 5px;
    text-align: center;
    white-space: nowrap;
  }
  > div {
    font-size: 3rem;
    margin: 0;
    text-align: center;
    &::before {
      content: '${props => props.prefix || ''}';
      opacity: 0.2;
      position: relative;
      left: -18px;
    }
  }
`

const graphMargin = { top: 80, left: 80, right: 80, bottom: 80 }

function getHighlightedArea(data, { maxY }) {
  const res = data
    .filter(d => d.Yval / 1000 >= maxY)
    .map(d => ({
      x: (d.Xcumsumleft + d.Xwidth / 2) / 1000,
      y: d.Yval / 1000,
    }))

  return res
}

export default function App() {
  const [xVal, setXVal] = useState(bounds.maxX / 1000)
  const [yVal, setYVal] = useState(20)

  const [view, setView] = React.useState('price')
  const [formats, setFormats] = React.useState(() => ['bold'])

  const highlightedPriceAreaData =
    view !== 'segments' ? getHighlightedArea(patientData, { maxY: yVal }) : []

  const handleViewChange = (event, newView) => {
    if (newView === 'price+vol') {
      setXVal(~~_.last(highlightedPriceAreaData).x)
    } else if (newView === 'price') {
      setXVal(bounds.maxX / 1000)
    }
    setView(newView)
  }

  return (
    <Container maxWidth="lg">
      <GridWrap>
        <Header>
          <Typography variant="h2" component="h1" gutterBottom>
            HCV Price Simulator
          </Typography>
          <p>
            Explore how drug pricing affects the number of patients we are able
            to treat.
          </p>
          <ViewNav>
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={handleViewChange}
            >
              <ToggleButton value="segments">
                <ViewColumnIcon />
                Segments
              </ToggleButton>
              <ToggleButton value="price">
                <VerticalAlignCenterIcon />
                Price
              </ToggleButton>
              <ToggleButton value="price+vol">
                <CropIcon />
                Price + Vol
              </ToggleButton>
            </ToggleButtonGroup>
          </ViewNav>
        </Header>
        <VerticalControls>
          <ContainerDimensions>
            {({ width, height }) => (
              <VerticalSlider
                bounds={bounds}
                height={height - (graphMargin.top + graphMargin.bottom)}
                onChange={(e, val) => {
                  setYVal(val)
                }}
                defaultValue={yVal}
                enabled={view !== 'segments'}
              />
            )}
          </ContainerDimensions>
        </VerticalControls>
        <HorizontalControls>
          <ContainerDimensions>
            {({ width, height }) =>
              view === 'price+vol' && (
                <HorizontalSlider
                  bounds={bounds}
                  width={width - (graphMargin.left + graphMargin.right)}
                  onChange={(e, val) => {
                    setXVal(val)
                  }}
                  defaultValue={xVal}
                  enabled={view === 'price+vol'}
                />
              )
            }
          </ContainerDimensions>
        </HorizontalControls>
        <GraphWrap>
          <ContainerDimensions>
            {({ width, height }) => (
              <SimGraph
                view={view}
                bounds={bounds}
                patientData={patientData}
                highlightValues={{ x: xVal, y: yVal }}
                highlightedPriceAreaData={highlightedPriceAreaData}
                height={height}
                width={width}
                margin={graphMargin}
                highlightLabels={{
                  y: !!yVal ? (
                    <LineLabel>
                      <label>drug price</label>
                      <div>${yVal}k</div>
                    </LineLabel>
                  ) : null,
                  x:
                    view === 'price+vol' ? (
                      <LineLabel prefix={'/'}>
                        <div>{xVal}k</div>
                        <label>patients</label>
                      </LineLabel>
                    ) : null,
                }}
              />
            )}
          </ContainerDimensions>
        </GraphWrap>
        <BreakdownWrap>
          <CuredMeter value={50} />
        </BreakdownWrap>
      </GridWrap>
    </Container>
  )
}
