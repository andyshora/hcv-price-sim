import React, { useState, useEffect } from 'react'
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
import SimGraph from './components/sim-graph'
import { VerticalSlider, HorizontalSlider } from './components/sliders'
import RadialProgress from './components/radial-progress'

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

function calculateBreakdown1({ bounds, data, x, y, totalArea }) {
  // get everything in the blue rect

  const filteredData = data.filter(d => d.Xwidth > 0 && d.Yval < y)

  const untreatedArea = filteredData.map(getArea).reduce((sum, v) => sum + v, 0)

  // blue rectangle - we have top left position, and it's a filled rectangle
  const curedArea =
    filteredData && filteredData.length
      ? filteredData[0].Yval * filteredData[0].Xcumsum
      : 0

  // todo - ensure we calc mid point

  const untreatedRatio = toSf(untreatedArea / totalArea, 3)
  const curedRatio = toSf(curedArea / totalArea, 3)
  const savingsRatio = 1 - (untreatedRatio + curedRatio)

  return {
    ratios: [curedRatio, untreatedRatio, savingsRatio],
    areas: [curedArea, untreatedArea, totalArea - (curedArea + untreatedArea)],
  }
}

function calculateBreakdown2({
  additionalRegionBounds,
  bounds,
  data,
  x,
  y,
  totalArea,
  breakdown1,
}) {
  const curedFract = breakdown1.areas[0]
  const untreatedFract = breakdown1.areas[1]

  const existingUntreatedArea = breakdown1.areas[1]
  const existingSavingsArea = breakdown1.areas[2]

  const newlyCuredArea = data
    .filter(
      d =>
        d.Xcumsumleft >= additionalRegionBounds.x0 &&
        d.Xcumsumleft <= additionalRegionBounds.x1
    )
    .map(getArea)
    .reduce((sum, v) => sum + v, 0)

  const additionalCostsArea =
    (additionalRegionBounds.x1 - additionalRegionBounds.x0) * y
  const previouslyCuredArea = additionalRegionBounds.x0 * y

  const additionalCostsFract =
    (additionalCostsArea - newlyCuredArea) / existingSavingsArea

  // console.log(
  //   'additionalCuredArea',
  //   (100 * additionalCuredArea) / previouslyCuredArea
  // )
  // console.log('newlyCuredArea', newlyCuredArea)
  const newlyCuredFract =
    untreatedFract * (newlyCuredArea / existingUntreatedArea)
  const areas = [
    breakdown1.areas[0],
    newlyCuredFract,
    untreatedFract - newlyCuredFract,
    additionalCostsArea, // todo - incorrect
  ]
  return {
    areas,
    ratios: areas.map(a => a / totalArea),
  }
}

function calculatePie1({ x = 0, x2 = 0, data }) {
  const sum1 = _.sumBy(data.filter(d => d.Xcumsumleft <= x), 'Xwidth')
  const sum2 = _.sumBy(data.filter(d => d.Xcumsumleft > x), 'Xwidth')
  const total = sum1 + sum2
  const seg1 = toSf((100 * sum1) / total, 1)

  const slicesArr = [seg1]

  if (x2) {
    slicesArr.push(toSf(x2 * 0.01 * (100 - seg1), 1))
  }

  return slicesArr
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
  const [xVal, setXVal] = useState(0)
  const [yVal, setYVal] = useState(20)
  const [breakdown1, setBreakdown1] = useState(null)
  const [breakdown2, setBreakdown2] = useState(null)

  const [view, setView] = React.useState('price')
  const [formats, setFormats] = React.useState(() => ['bold'])

  const areaColors = [
    '#fce0ff',
    'rgba(111, 111, 111)',
    '#6c9bdc',
    'rgb(51, 229, 255)',
  ]
  const areaColors2 = ['#f9d129', 'rgba(111, 111, 111)', '#30C1D7', '#6c9bdc']

  const breakdownColors = ['#6c9bdc', 'rgba(111, 111, 111)', '#fce0ff']
  const breakdownColors2 = [
    '#6c9bdc',
    '#30C1D7',
    'rgba(111, 111, 111)',
    '#f9d129',
  ]

  const totalArea = getTotalArea(patientData)

  useEffect(() => {
    const newBreakdown1 = calculateBreakdown1({
      data: patientData,
      bounds,
      y: yVal * 1000,
      totalArea,
    })
    setBreakdown1(newBreakdown1.ratios)

    if (view !== 'segments' && xVal) {
      const x0 =
        highlightedPriceAreaData && highlightedPriceAreaData.length
          ? _.last(highlightedPriceAreaData).xVal
          : 0
      const x1 = x0 + xVal * 0.01 * (bounds.maxX - x0)

      const newBreakdown2 = calculateBreakdown2({
        additionalRegionBounds: { x0, x1 },
        data: patientData,
        bounds,
        x: xVal,
        y: yVal * 1000,
        totalArea,
        breakdown1: newBreakdown1,
      })
      setBreakdown2(newBreakdown2.ratios)
    }
  }, [xVal, yVal, view])

  const highlightedPriceAreaData =
    view !== 'segments' ? getHighlightedArea(patientData, { maxY: yVal }) : []
  const xPercOffset =
    view !== 'segments' &&
    highlightedPriceAreaData &&
    highlightedPriceAreaData.length
      ? _.last(highlightedPriceAreaData).xVal / bounds.maxX
      : 0

  let pie1 = null
  if (
    view !== 'segments' &&
    highlightedPriceAreaData &&
    highlightedPriceAreaData.length
  ) {
    pie1 = calculatePie1({
      x: _.last(highlightedPriceAreaData).xVal,
      x2: xVal || 0,
      data: patientData,
    })
  }

  const handleViewChange = (event, newView) => {
    // if (newView === 'price') {
    //   setXVal(0)
    // }
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
              view !== 'segments' && (
                <HorizontalSlider
                  bounds={bounds}
                  width={
                    (width - (graphMargin.left + graphMargin.right)) *
                    (1 - xPercOffset)
                  }
                  margin={`0 ${graphMargin.right}px 0 0`}
                  onChange={(e, val) => {
                    setXVal(val)
                  }}
                  defaultValue={xVal}
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
              />
            )}
          </ContainerDimensions>
        </GraphWrap>
        <BreakdownWrap>
          {view !== 'segments' && breakdown1 && (
            <CostBreakdown
              offsetForComplete={250}
              height={500}
              items={breakdown1}
              colors={breakdownColors}
            />
          )}
          {view !== 'segments' && xVal && breakdown2 ? (
            <CostBreakdown
              offsetForComplete={250}
              height={500}
              items={breakdown2}
              colors={breakdownColors2}
            />
          ) : (
            ''
          )}
          {view !== 'segments' && pie1 && pie1.length && (
            <RadialProgress
              values={pie1}
              max={100}
              width={200}
              height={200}
              suffix={'%'}
              title="Patients Cured"
              colors={[areaColors[2], areaColors[3]]}
              label={_.sum(pie1).toFixed(0)}
            />
          )}
        </BreakdownWrap>
      </GridWrap>
    </Container>
  )
}
