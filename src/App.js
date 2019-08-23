import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ContainerDimensions from 'react-container-dimensions'
import _ from 'lodash'

import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
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

import {
  GridWrap,
  Header,
  VerticalControls,
  HorizontalControls,
  GraphWrap,
  BreakdownWrap,
  ViewNav,
  LineLabel,
} from './App.styles'

// data
import patientData from './data/data.json'
import bounds from './data/bounds.json'

function getArea({ Xwidth, Yval }) {
  return Xwidth * Yval
}

function getTotalArea(data) {
  return data
    .filter(d => d.Xwidth > 0)
    .map(getArea)
    .reduce((sum, v) => sum + v)
}

function toSf(val, num = 2) {
  return ~~(val * Math.pow(10, num)) / Math.pow(10, num)
}

function calculateBreakdown({ bounds, data, x, y, totalArea }) {
  // get everything in the blue rect

  const filteredData = data.filter(d => d.Xwidth > 0 && d.Yval < y)

  const untreatedArea = filteredData.map(getArea).reduce((sum, v) => sum + v, 0)

  // blue rectangle - we have top left position, and it's a filled rectangle
  const curedArea =
    filteredData && filteredData.length
      ? filteredData[0].Yval * filteredData[0].Xcumsum
      : 0

  // todo - ensure we calc mid point

  const untreatedRatio = untreatedArea / totalArea
  const curedRatio = curedArea / totalArea
  const savingsRatio = 1 - (untreatedRatio + curedRatio)

  return [toSf(savingsRatio, 3), toSf(untreatedRatio, 3), toSf(curedRatio, 3)]
}

const graphMargin = { top: 80, left: 80, right: 80, bottom: 80 }

function getHighlightedArea(data, { maxY }) {
  const res = data
    .filter(d => d.Yval / 1000 >= maxY)
    .map(d => ({
      xVal: d.Xcumsumleft + d.Xwidth / 2,
      x: (d.Xcumsumleft + d.Xwidth / 2) / 1000,
      y: d.Yval / 1000,
    }))

  return res
}

export default function App() {
  const [xVal, setXVal] = useState(15)
  const [yVal, setYVal] = useState(20)
  const [breakdown, setBreakdown] = useState(null)

  const [view, setView] = React.useState('price+vol')
  const [formats, setFormats] = React.useState(() => ['bold'])
  const areaColors = [
    theme.palette.series[4],
    'rgba(111, 111, 111)',
    theme.palette.series[2],
    theme.palette.series[1],
  ]

  const totalArea = getTotalArea(patientData)

  useEffect(() => {
    const newBreakdown = calculateBreakdown({
      data: patientData,
      bounds,
      y: yVal * 1000,
      totalArea,
    })
    setBreakdown(newBreakdown)
  }, [xVal, yVal])

  const highlightedPriceAreaData =
    view !== 'segments' ? getHighlightedArea(patientData, { maxY: yVal }) : []

  const handleViewChange = (event, newView) => {
    if (
      newView === 'price+vol' &&
      highlightedPriceAreaData &&
      highlightedPriceAreaData.length
    ) {
      // setXVal(~~_.last(highlightedPriceAreaData).x * 100 / bounds.maxX)
      // when switching to price+vol view, set to +10% to show a peek of the new area
      setXVal(15)
    } else if (newView === 'price') {
      setXVal(0)
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
                areaColors={areaColors}
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
                        <div>+{xVal}%</div>
                        <label>patients</label>
                      </LineLabel>
                    ) : null,
                }}
              />
            )}
          </ContainerDimensions>
        </GraphWrap>
        {view !== 'segments' && breakdown && (
          <BreakdownWrap>
            <CostBreakdown items={breakdown} areaColors={areaColors} />
            {/* <CuredMeter value={50} /> */}
          </BreakdownWrap>
        )}
      </GridWrap>
    </Container>
  )
}
