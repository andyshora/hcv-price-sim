import React, { useCallback, useState, useEffect, useRef } from 'react'
import ContainerDimensions from 'react-container-dimensions'
import _ from 'lodash'

import { useHotkeys } from 'react-hotkeys-hook'

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
import Presets from './components/presets'

import theme from './theme'

import {
  GridWrap,
  PresetsWrap,
  Header,
  VerticalControls,
  HorizontalControls,
  GraphWrap,
  BreakdownWrap,
  ViewNav,
} from './App.styles'

// data
import patientData from './data/data.json'
import bounds from './data/bounds.json'
import { Button } from '@material-ui/core'

const defaultPresets = [
  {
    label: '',
    x: 25,
    y: 20,
  },
  {
    label: '',
    x: 50,
    y: 30,
  },
  {
    label: '',
    x: 70,
    y: 32,
  },
]

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

  const savingsArea = totalArea - (curedArea + untreatedArea)
  // todo verify this area is the same as long calc
  // (yVal - y) * range Xwidths

  return {
    ratios: [curedRatio, untreatedRatio, savingsRatio],
    areas: [curedArea, untreatedArea, savingsArea],
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
  const existingCuredArea = breakdown1.areas[0]
  const existingUntreatedArea = breakdown1.areas[1]

  // todo - check this
  const newlyCuredArea = data
    .filter(
      d =>
        d.Xcumsumleft >= additionalRegionBounds.x0 &&
        d.Xcumsumleft <= additionalRegionBounds.x1
    )
    .map(getArea)
    .reduce((sum, v) => sum + v, 0)

  const additionalCostsArea =
    (additionalRegionBounds.x1 - additionalRegionBounds.x0) * y - newlyCuredArea

  const baselineTotalArea = totalArea - breakdown1.areas[2]
  const temp1 =
    (additionalCostsArea +
      newlyCuredArea +
      existingCuredArea +
      (existingUntreatedArea - newlyCuredArea)) /
    baselineTotalArea
  // console.log('temp1', temp1)

  // const newlyCuredArea =
  //   untreatedArea * (newlyCuredArea / existingUntreatedArea)
  const areas = [
    breakdown1.areas[0],
    newlyCuredArea,
    existingUntreatedArea - newlyCuredArea,
    additionalCostsArea,
  ]
  return {
    areas,
    ratios: areas.map(a => a / totalArea),
  }
}

function calculatePie1({ x = 0, xPerc = 0, data, bounds }) {
  const sum1 = _.sumBy(data.filter(d => d.Xcumsumleft <= x), 'Xwidth')
  const total = bounds.maxX
  const seg1 = toSf((100 * sum1) / total, 1)

  const remainingPatients = total - sum1
  const slicesArr = [seg1]

  // using slider %, calculate abs patient bounds who are now cured in the new region
  if (xPerc) {
    slicesArr.push(toSf((xPerc * remainingPatients) / total, 1))
  }

  return slicesArr
}

const graphMargin = { top: 80, left: 80, right: 80, bottom: 80 }

function getHighlightedArea(data, { maxY }) {
  const res = data
    .filter(d => d.Yval / 1000 >= maxY)
    .map(d => ({
      xLeft: d.Xcumsumleft,
      xVal: d.Xcumsumleft + d.Xwidth,
      x: (d.Xcumsumleft + d.Xwidth) / 1000,
      xRight: d.Xcumsum,
      y: d.Yval / 1000,
    }))

  return res
}

function saveToLocalStorage(key, value) {
  if (typeof window !== 'undefined' && 'localStorage' in window) {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

function getFromLocalStorage(key) {
  let res = null
  if (typeof window !== 'undefined' && 'localStorage' in window) {
    res = localStorage.getItem(key)
  }
  return JSON.parse(res)
}

export default function App() {
  const [xVal, setXVal] = useState(0)
  const [yVal, setYVal] = useState(20)
  const [savingPreset, setSavingPreset] = useState(false)
  const [breakdown1, setBreakdown1] = useState(null)
  const [breakdown2, setBreakdown2] = useState(null)
  // const [presets, setPresets] = useState([])
  const [totalCostAsPerc, setTotalCostAsPerc] = useState(null)
  function setPresets(p) {
    presets.current = p
  }

  const presets = useRef(defaultPresets)

  const [view, setView] = React.useState('segments')

  function handlePresetKeyTapped(index) {
    if (index <= presets.current.length) {
      handlePresetSelected(index, presets.current[index])
    }
  }

  useHotkeys('1, 2, 3, 4, 5', handleHotkeyTapped)

  function handleHotkeyTapped({ key }) {
    handlePresetKeyTapped(Number.parseInt(key) - 1)
  }

  function handleSavePresetTapped() {
    setSavingPreset(true)
  }

  const areaColors = [
    '#fce0ff',
    'rgba(111, 111, 111)',
    '#6c9bdc',
    'rgb(51, 229, 255)',
    '#f9d129',
  ]

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
      setTotalCostAsPerc(_.sum(newBreakdown2.ratios))
    }
  }, [xVal, yVal, view])

  useEffect(() => {
    const persistedPresets = getFromLocalStorage('presets')
    if (persistedPresets) {
      setPresets(persistedPresets)
    }
  }, [])

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
      x: _.last(highlightedPriceAreaData).xRight,
      xPerc: xVal || 0,
      data: patientData,
      bounds,
    })
  }

  function handleViewChange(event, newView) {
    setView(newView)
    if (savingPreset) {
      setSavingPreset(false)
    }
  }

  function handlePresetSelected(i, { x, y }) {
    if (savingPreset) {
      const newPresets = [...presets.current]
      newPresets[i] = {
        label: null,
        x: xVal,
        y: yVal,
      }
      setPresets(newPresets)
      setSavingPreset(false)
      saveToLocalStorage('presets', newPresets)
    } else {
      // if (x !== xVal) {
      setXVal(x)
      // }
      // if (y !== yVal) {
      setYVal(y)
      // }
    }
  }

  return (
    <Container maxWidth="lg">
      <GridWrap>
        <Header>
          <div>
            <Typography variant="h2" component="h1" gutterBottom>
              HCV Price Simulator
            </Typography>
            <p>
              Explore how drug pricing affects the number of patients we are
              able to treat.
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
          </div>
        </Header>
        <VerticalControls>
          <ContainerDimensions>
            {({ width, height }) => {
              return (
                <VerticalSlider
                  max={bounds.maxYInput / 1000}
                  bounds={bounds}
                  height={
                    ((height - (graphMargin.top + graphMargin.bottom)) *
                      bounds.maxYInput) /
                    bounds.maxY
                  }
                  margin={`auto 0 ${graphMargin.bottom}px 0`}
                  onChange={(e, val) => {
                    setYVal(val)
                    if (savingPreset) {
                      setSavingPreset(false)
                    }
                  }}
                  defaultValue={yVal}
                  enabled={view !== 'segments'}
                />
              )
            }}
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
                    if (savingPreset) {
                      setSavingPreset(false)
                    }
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
            <>
              <CostBreakdown
                offsetForComplete={150}
                height={450}
                scaleToBounds={totalCostAsPerc}
                items={breakdown1}
                colors={breakdownColors}
                title={xVal ? `Costs Before` : `Alloc'd Costs`}
              />
              <CostBreakdown
                offsetForComplete={150}
                height={450}
                scaleToBounds={totalCostAsPerc}
                items={breakdown2}
                colors={breakdownColors2}
                title={`Costs After`}
                enabled={xVal && breakdown2}
              />
            </>
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
      {view !== 'segments' && (
        <PresetsWrap>
          <Presets
            items={presets.current}
            onItemSelected={handlePresetSelected}
            replaceMode={savingPreset}
          />
          <Button
            size="small"
            variant="outlined"
            onClick={handleSavePresetTapped}
          >
            Save current state as hotkey
          </Button>
          {savingPreset && (
            <Button
              size="small"
              variant="outlined"
              onClick={() => setSavingPreset(false)}
            >
              Cancel
            </Button>
          )}
        </PresetsWrap>
      )}
    </Container>
  )
}
