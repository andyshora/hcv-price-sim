import React, { useState, useEffect, useRef } from 'react'
import ContainerDimensions from 'react-container-dimensions'
import _ from 'lodash'

import { useHotkeys } from 'react-hotkeys-hook'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ViewColumnIcon from '@material-ui/icons/ViewColumn'
import VerticalAlignCenterIcon from '@material-ui/icons/VerticalAlignCenter'
import SaveIcon from '@material-ui/icons/Save'
import { Button, Paper } from '@material-ui/core'

import CostBreakdown from './components/cost-breakdown'
import { VerticalSlider, HorizontalSlider } from './components/sliders'
import RadialProgress from './components/radial-progress'
import Presets from './components/presets'
import SegTimeChart from './components/seg-time-chart'
import SegPatientChart from './components/seg-patient-chart'
import PriceTimeChart from './components/price-time-chart'
import PricePatientChart from './components/price-patient-chart'

import StaticChartView from './views/static-chart-view'

import {
  LayoutWrap,
  LayoutHeader,
  LayoutSidebar,
  LayoutDial,
  LayoutMain,
  LayoutFooter,
  LayoutNav,
  DynamicChartViewWrap,
  PresetsWrap,
  VerticalControls,
  HorizontalControls,
  GraphWrap,
  SimpleGraphWrap,
  BreakdownWrap,
  ViewNav,
  VerticalCenter,
  CuredWrap,
  ChartWrap,
} from './App.styles'

// data
import areaData from './data/areas.json'
import patientData from './data/cleaned.json'
import segTimeData from './data/segtime.json'
import priceTimeData from './data/pricetime.json'

import bounds from './data/bounds.json'
import { colorScales } from './theme'

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
  {
    label: '',
    x: 70,
    y: 32,
  },
  {
    label: '',
    x: 70,
    y: 32,
  },
  {
    label: '',
    x: 70,
    y: 32,
  },
]

function toSf(val, num = 2) {
  return ~~(val * Math.pow(10, num)) / Math.pow(10, num)
}

function calculateBreakdown1({ data, x, y, totalArea }) {
  // get everything in the blue rect

  const filteredData = data.filter(d => d.Xwidth > 0 && d.Yval < y)

  const untreatedArea = filteredData.reduce((sum, d) => sum + d.area, 0)

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

  const res = {
    total: totalArea,
    bars: [
      { ratio: curedRatio, area: curedArea, key: 'Drug' },
      { ratio: untreatedRatio, area: untreatedArea, key: 'Hospital' },
      { ratio: savingsRatio, area: savingsArea, key: 'Saving' },
    ],
  }

  return res
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
  const existingUntreatedArea = breakdown1.bars[1].area
  const existingSavingArea = breakdown1.bars[2].area

  // todo - check this
  const newlyCuredArea = data
    .filter(
      d =>
        d.Xcumsumleft >= additionalRegionBounds.x0 &&
        d.Xcumsumleft <= additionalRegionBounds.x1
    )
    .reduce((sum, d) => sum + d.area, 0)

  const additionalCostsArea =
    (additionalRegionBounds.x1 - additionalRegionBounds.x0) * y - newlyCuredArea

  let bars = [
    { ratio: 0, area: breakdown1.bars[0].area, key: 'Drug' },
    { ratio: 0, area: newlyCuredArea, key: '+Drug' },
    {
      ratio: 0,
      area: existingUntreatedArea - newlyCuredArea,
      key: 'Hospital',
    },
    { ratio: 0, area: additionalCostsArea, key: '+Cost' },
  ].map(b => ({ ...b, ratio: b.area / totalArea }))

  const res = {
    total: totalArea + additionalCostsArea - existingSavingArea,
    bars,
  }

  return res
}

function createSeriesData({ cutOffX, data, perc }) {
  const res = {
    hospital: [],
    drug: [],
    savings: [],
  }
  const maxLen = cutOffX || data.total.length
  for (let i = 0; i < maxLen; i++) {
    const total = data.total[i] / 1e6
    const hospital = data.hospital[i] / 1e6
    const hospitalElm = { x: i + 1, y: hospital }
    const drugElm = {
      x: i + 1,
      y: i > 9 ? data.drugEnd[i - 10] / 1e6 : perc * total,
    }
    const savingsElm = { x: i + 1, y: total - (hospitalElm.y + drugElm.y) }
    res.hospital.push(hospitalElm)
    res.drug.push(drugElm)
    res.savings.push(savingsElm)
  }

  return res
}

function calculateTimeBreakdown({ bounds, cutOffX, data, y }) {
  const areas = {
    hospital: 0,
    drug: 0,
    saving: 0,
  }

  const maxLen = cutOffX || data.total.length
  for (let i = 0; i < maxLen; i++) {
    const total = data.total[i]
    const hospital = data.hospital[i]
    const drug = i > 9 ? data.drugEnd[i - 10] : y * total
    const saving = total - (hospital + drug)
    areas.hospital += hospital
    areas.drug += drug
    areas.saving += saving
  }

  const totalArea = areas.hospital + areas.drug + areas.saving

  const res = {
    total: totalArea,
    bars: [
      { key: 'Drug', area: areas.drug, ratio: areas.drug / totalArea },
      {
        key: 'Hospital',
        area: areas.hospital,
        ratio: areas.hospital / totalArea,
      },
      { key: 'Saving', area: areas.saving, ratio: areas.saving / totalArea },
    ],
  }

  return res
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

const graphMargin = { top: 10, left: 80, right: 10, bottom: 80 }

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

const useStyles = makeStyles(theme => ({
  toggleButtonGroup: {},
}))

export default function App() {
  const classes = useStyles()
  const [xVal, setXVal] = useState(0)
  const [yVal, setYVal] = useState(20)
  const [savingPreset, setSavingPreset] = useState(false)
  const [breakdown1, setBreakdown1] = useState(null)
  const [breakdown2, setBreakdown2] = useState(null)

  const [cost1, setCost1] = useState(null)
  const [cost2, setCost2] = useState(null)
  // const [presets, setPresets] = useState([])
  const [totalCostAsPerc, setTotalCostAsPerc] = useState(null)
  function setPresets(p) {
    presets.current = p
  }

  const presets = useRef(defaultPresets)

  const [view, setView] = React.useState('seg/patient')

  function handlePresetKeyTapped(index) {
    if (index <= presets.current.length) {
      handlePresetSelected(index, presets.current[index])
    }
  }

  useHotkeys('1, 2, 3, 4, 5, 6', handleHotkeyTapped)

  function handleHotkeyTapped({ key }) {
    handlePresetKeyTapped(Number.parseInt(key) - 1)
  }

  function handleSavePresetTapped() {
    setSavingPreset(true)
  }

  const areaColors = [
    'rgb(116, 222, 147)',
    'rgba(111, 111, 111)',
    '#6c9bdc',
    'rgb(51, 229, 255)',
    '#f9d129',
  ]

  const breakdownColorsPrice = [
    '#6c9bdc',
    'rgba(111, 111, 111)',
    'rgb(116, 222, 147)',
  ]
  const breakdownColorsPrice2 = [
    '#6c9bdc',
    '#30C1D7',
    'rgba(111, 111, 111)',
    '#f9d129',
  ]
  const breakdownColorsTime = [
    colorScales.jmi[3],
    colorScales.jmi[2],
    colorScales.jmi[1],
    colorScales.jmi[0],
  ]

  const { totalArea } = bounds

  useEffect(() => {
    let newBreakdown1 = null

    switch (view) {
      case 'price/patient':
        newBreakdown1 = calculateBreakdown1({
          data: patientData,
          bounds,
          y: yVal * 1000,
          totalArea, // todo - wrong
        })
        break
      case 'price/time':
        newBreakdown1 = calculateTimeBreakdown({
          data: priceTimeData,
          bounds,
          y: yVal * 0.01,
          totalArea: bounds.totalSegArea,
          cutOffX: null,
        })
        break
      case 'seg/time': {
        newBreakdown1 = {
          total: bounds.totalSegArea,
          bars: areaData,
        }
      }
      default:
        newBreakdown1 = {
          total: bounds.totalSegArea,
          bars: areaData,
        }
        break
    }
    setBreakdown1(newBreakdown1)
    setCost1(newBreakdown1.totalCost)

    if (view === 'price/patient' && xVal) {
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
      setBreakdown2(newBreakdown2)
      setCost2(newBreakdown2.totalCost)
      setTotalCostAsPerc(_.sumBy(newBreakdown2.bars, d => d.ratio))
    }
  }, [xVal, yVal, view, totalArea])

  useEffect(() => {
    const persistedPresets = getFromLocalStorage('presets')
    // new default presets might be longer
    if (persistedPresets && defaultPresets.length > persistedPresets.length) {
      for (
        let i = persistedPresets.length - 1;
        i < defaultPresets.length - 1;
        i++
      ) {
        persistedPresets.push(defaultPresets[i])
      }
    }
    if (persistedPresets) {
      setPresets(persistedPresets)
    }
  }, [])

  const highlightedPriceAreaData =
    view === 'price/patient'
      ? getHighlightedArea(patientData, { maxY: yVal })
      : []
  const xPercOffset =
    view === 'price/patient' &&
    highlightedPriceAreaData &&
    highlightedPriceAreaData.length
      ? _.last(highlightedPriceAreaData).xVal / bounds.maxX
      : 0

  let pie1 = null
  if (highlightedPriceAreaData && highlightedPriceAreaData.length) {
    pie1 = calculatePie1({
      x: _.last(highlightedPriceAreaData).xRight,
      xPerc: xVal || 0,
      data: patientData,
      bounds,
    })
  }

  function handleViewChange(event, newView) {
    setYVal(20)
    if (newView) {
      setView(newView)
    }
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

  let legendItems = [
    {
      title: 'Health system savings',
      color: areaColors[0],
      strokeWidth: 20,
      enabled: true,
    },
    {
      title: 'Untreated patient cost',
      color: areaColors[1],
      strokeWidth: 20,
      enabled: true,
    },
    {
      title: 'Cost for cure',
      color: areaColors[2],
      strokeWidth: 20,
      enabled: true,
    },
  ]

  if (xVal) {
    legendItems.splice(2, 0, {
      title: 'Newly cured cost',
      color: areaColors[3],
      strokeWidth: 20,
      enabled: true,
    })
    legendItems.unshift({
      title: 'Additional cure cost',
      color: areaColors[4],
      strokeWidth: 20,
      enabled: true,
    })
  }

  function getMainView({ view, dims }) {
    const { width, height } = dims
    switch (view) {
      case 'price/patient': {
        const margin = { top: 10, left: 80, right: 10, bottom: 120 }
        return (
          <DynamicChartViewWrap>
            <VerticalControls>
              <VerticalSlider
                min={0.5}
                step={0.5}
                max={bounds.maxYInput / 1000}
                bounds={bounds}
                height={
                  ((height - (margin.top + margin.bottom)) * bounds.maxYInput) /
                  bounds.maxY
                }
                margin={`auto 0 ${-50 + margin.bottom}px 0`}
                onChange={(e, val) => {
                  setYVal(val)
                  if (savingPreset) {
                    setSavingPreset(false)
                  }
                }}
                defaultValue={yVal}
                valueLabelSuffix="K"
              />
            </VerticalControls>
            <HorizontalControls>
              <HorizontalSlider
                bounds={bounds}
                width={
                  (width - (100 + margin.left + margin.right)) *
                  (1 - xPercOffset)
                }
                margin={`0 ${margin.right}px 0 0`}
                onChange={(e, val) => {
                  setXVal(val)
                  if (savingPreset) {
                    setSavingPreset(false)
                  }
                }}
                defaultValue={xVal}
              />
            </HorizontalControls>
            <ChartWrap>
              <PricePatientChart
                areaColors={areaColors}
                view={view}
                bounds={bounds}
                patientData={patientData}
                highlightValues={{ x: xVal, y: yVal }}
                highlightedPriceAreaData={highlightedPriceAreaData}
                width={width}
                height={height}
                margin={margin}
              />
            </ChartWrap>
          </DynamicChartViewWrap>
        )
      }
      case 'seg/patient':
        return (
          <StaticChartView title={view} {...dims}>
            <SegPatientChart
              margin={{ top: 10, left: 180, right: 10, bottom: 120 }}
              height={height}
              data={patientData}
              bounds={bounds}
              colors={areaColors}
            />
          </StaticChartView>
        )
        break
      case 'seg/time':
        return (
          <StaticChartView title={view} {...dims}>
            <SegTimeChart
              margin={{ top: 10, left: 180, right: 10, bottom: 120 }}
              height={height}
              data={segTimeData}
              bounds={bounds}
              cutOffX={null}
            />
          </StaticChartView>
        )
        break
      case 'price/time': {
        const margin = { top: 10, left: 80, right: 10, bottom: 120 }
        const seriesData = createSeriesData({
          cutOffX: null,
          data: priceTimeData,
          perc: yVal * 0.01,
        })
        return (
          <DynamicChartViewWrap>
            <VerticalControls>
              <VerticalSlider
                min={0}
                step={1}
                max={65}
                bounds={bounds}
                height={height / 2 - (margin.top + margin.bottom)}
                margin={`auto 0 ${-40 + margin.bottom}px 0`}
                onChange={(e, val) => {
                  setYVal(val)
                  if (savingPreset) {
                    setSavingPreset(false)
                  }
                }}
                valueLabelSuffix="%"
              />
            </VerticalControls>
            <HorizontalControls>
              <div />
            </HorizontalControls>
            <ChartWrap>
              <PriceTimeChart
                margin={margin}
                seriesData={seriesData}
                bounds={bounds}
                colors={areaColors}
                perc={yVal / 100}
              />
            </ChartWrap>
          </DynamicChartViewWrap>
        )
      }

      default:
        return <StaticChartView title={view} {...dims} />
    }
  }

  return (
    <LayoutWrap>
      <LayoutHeader>
        <Typography variant="h3" gutterBottom>
          {view}
        </Typography>
      </LayoutHeader>
      <LayoutSidebar>
        <ContainerDimensions>
          {({ width, height }) => {
            const breakdownWidth =
              view === 'price/patient' ? width * 0.5 : width
            return (
              breakdown1 && (
                <>
                  <CostBreakdown
                    offsetForComplete={150}
                    height={height}
                    width={breakdownWidth}
                    scaleToBounds={totalCostAsPerc}
                    items={breakdown1}
                    colors={
                      view === 'price/patient' || view === 'price/time'
                        ? breakdownColorsPrice
                        : breakdownColorsTime
                    }
                    align="right"
                    title={
                      xVal ? 'Without uneconomical patients' : 'Total Cost'
                    }
                  />
                  <CostBreakdown
                    offsetForComplete={150}
                    height={height}
                    width={breakdownWidth}
                    scaleToBounds={totalCostAsPerc}
                    items={breakdown2}
                    colors={breakdownColorsPrice2}
                    align="left"
                    title={'With uneconomical patients'}
                    enabled={view === 'price/patient' && xVal && breakdown2}
                  />
                </>
              )
            )
          }}
        </ContainerDimensions>
        <LayoutDial>
          {pie1 && view === 'price/patient' && (
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
          {view === 'price/time' && (
            <RadialProgress
              values={[94]}
              max={100}
              width={200}
              height={200}
              suffix={'%'}
              title="Patients Cured"
              colors={[areaColors[2]]}
              label={94}
            />
          )}
        </LayoutDial>
      </LayoutSidebar>
      <LayoutMain>
        <ContainerDimensions>
          {dims => getMainView({ view, dims })}
        </ContainerDimensions>
      </LayoutMain>
      <LayoutFooter>
        <LayoutNav>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            className={classes.toggleButtonGroup}
          >
            <ToggleButton value="seg/patient">
              <ViewColumnIcon />
              seg/patient
            </ToggleButton>
            <ToggleButton value="seg/time">
              <ViewColumnIcon />
              seg/time
            </ToggleButton>
            <ToggleButton value="price/patient">
              <VerticalAlignCenterIcon />
              price/patient
            </ToggleButton>
            <ToggleButton value="price/time">
              <VerticalAlignCenterIcon />
              price/time
            </ToggleButton>
          </ToggleButtonGroup>
        </LayoutNav>
        {view === 'price/patient' && (
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
              title="Save current state as hotkey"
            >
              <SaveIcon size="small" />
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
      </LayoutFooter>
    </LayoutWrap>
  )
}
