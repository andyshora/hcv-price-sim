import React, { useCallback, useState, useEffect, useRef } from 'react'
import ContainerDimensions from 'react-container-dimensions'
import _ from 'lodash'

import { useHotkeys } from 'react-hotkeys-hook'
import { makeStyles } from '@material-ui/core/styles'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ViewColumnIcon from '@material-ui/icons/ViewColumn'
import TransformIcon from '@material-ui/icons/Transform'
import DeviceHubIcon from '@material-ui/icons/DeviceHub'

import VerticalAlignCenterIcon from '@material-ui/icons/VerticalAlignCenter'
import BarChartIcon from '@material-ui/icons/BarChart'
import SaveIcon from '@material-ui/icons/Save'
import { Button, Paper } from '@material-ui/core'

import { VerticalSlider, HorizontalSlider } from './components/sliders'
import CostBreakdown from './components/cost-breakdown'
import RadialProgress from './components/radial-progress'
import Presets from './components/presets'
import SegTimeChart from './components/seg-time-chart'
import SegPatientChart from './components/seg-patient-chart'
import PriceTimeChart from './components/price-time-chart'
import PricePatientChart from './components/price-patient-chart'

import StaticChartView from './views/static-chart-view'

import {
  CostBreakdownWrap,
  Overlay,
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
  ChartWrap,
  SwitchWrap,
  SummaryGrid,
  SummaryWrap,
  SpanSVG,
} from './App.styles'

// data
import areaData from './data/areas.json'
import patientData from './data/cleaned.json'
import pricePatientMarks from './data/marks.json'
import segTimeData from './data/segtime.json'
import priceTimeData from './data/pricetime.json'

import bounds from './data/bounds.json'
import theme, { colorScales } from './theme'
import {
  navSteps,
  sliderBounds,
  defaultPatientPresets,
  defaultTimePresets,
  areaColors,
  breakdownColorsPrice,
  breakdownColorsPrice2,
} from './config'

// console.log(
//   navSteps.map(({ name }) => {
//     console.log(name)
//   })
// )

const breakdownColorsTime = [
  colorScales.jmi[3],
  colorScales.jmi[2],
  colorScales.jmi[1],
  colorScales.jmi[0],
]

const { totalArea } = bounds

const SpanBracketSVG = ({ width, height }) => {
  const pathData = ['M 0 0', 'h 100'].join(' ')
  return (
    <SpanSVG viewBox="0 0 100 40" width={width} height={height}>
      <g>
        <path stroke="white" fill="none" d={pathData} />
      </g>
    </SpanSVG>
  )
}

function getTitle({ view, subscriptionEnabled }) {
  switch (view) {
    case 'price/patient':
      return 'Price per patient simulation'
    case 'price/time':
      if (subscriptionEnabled) {
        return 'Annual price per population over 10 year contract'
      } else {
        return 'Price per patient simulation over 10 years'
      }

    case 'seg/time':
      return 'Hepatitis C health care cost per year for 100K patients'

    default:
      return 'Hepatitis C health care cost per patient for 100K patients'
  }
}

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
    { ratio: 0, area: breakdown1.bars[0].area + newlyCuredArea, key: 'Drug' },
    {
      ratio: 0,
      area: existingUntreatedArea - newlyCuredArea,
      key: 'Hospital',
    },
    { ratio: 0, area: additionalCostsArea, key: 'Inc Drug Cost' },
  ].map(b => ({ ...b, ratio: b.area / totalArea }))

  const res = {
    total: totalArea + additionalCostsArea - existingSavingArea,
    bars,
  }

  return res
}

function createSeriesData({ cutOffX, data, perc, dynamic = false }) {
  const res = {
    hospital: [],
    drug: [],
    savings: [],
  }
  if (!dynamic) {
    const maxLen = cutOffX || data.savings.length
    for (let i = 0; i < maxLen; i++) {
      const hospitalElm = { x: i + 1, y: data.hospital[i] / 1e6 }

      const drugElm = {
        x: i + 1,
        y: data.drug[i] / 1e6,
      }
      const savingsElm = { x: i + 1, y: data.savings[i] / 1e6 }
      res.hospital.push(hospitalElm)
      res.drug.push(drugElm)
      res.savings.push(savingsElm)
    }
  } else {
    const maxLen = cutOffX || data.total.length
    // only year 1 drug price is dynamic
    const year1DrugVal = perc * (data.total[0] / 1e6)
    for (let i = 0; i < maxLen; i++) {
      const total = data.total[i] / 1e6
      const hospital = data.hospital[i] / 1e6
      const hospitalElm = { x: i + 1, y: hospital }
      const drugElm = {
        x: i + 1,
        y: year1DrugVal,
      }
      const savingsElm = { x: i + 1, y: total - (hospitalElm.y + drugElm.y) }
      res.hospital.push(hospitalElm)
      res.drug.push(drugElm)
      res.savings.push(savingsElm)
    }
  }
  return res
}

function calculateTimeBreakdown({ dynamic = true, cutOffX, data, y }) {
  const areas = {
    hospital: 0,
    drug: 0,
    saving: 0,
  }

  const maxLen = cutOffX || data.total.length

  // only year 1 drug price is dynamic
  const year1DrugVal = dynamic ? y * data.total[0] : 0
  for (let i = 0; i < maxLen; i++) {
    const total = data.total[i]
    const hospital = data.hospital[i]
    const drug = dynamic ? year1DrugVal : data.drug[i]
    const saving = total - (hospital + drug)
    areas.hospital += hospital
    areas.drug += drug
    areas.saving += saving
  }

  const totalArea = areas.hospital + areas.drug + areas.saving

  const res = {
    total: totalArea,
    bars: [
      { key: 'Drug 1', area: areas.drug, ratio: areas.drug / totalArea },
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

function getHighlightedArea(maxY) {
  let i = 0
  const res = []
  for (i = 0; i < patientData.length; i++) {
    const d = patientData[i]
    if (d.Yval / 1000 < maxY) {
      break
    }
    res.push({
      Yval: d.Yval,
      area: d.area,
      Xwidth: d.Xwidth,
      xLeft: d.Xcumsumleft,
      xVal: d.Xcumsumleft + d.Xwidth / 2,
      x: (d.Xcumsumleft + d.Xwidth) / 1000,
      xRight: d.Xcumsum,
      Xcumsumleft: d.Xcumsumleft,
      Xcumsum: d.Xcumsum,
      y: d.Yval / 1000,
    })
  }

  return res
}

// // const getHighlightedArea = useMemo(() => _getHighlightedArea(data, maxY), [maxY])

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
  toggleButtonGroup: {
    width: 460,
    display: 'grid',
    gridTemplateAreas: `
    "a b c"
    "d e c"`,
    gridTemplateColumns: '0.5fr 0.5fr 120px',
    marginLeft: 140,
  },
}))

export default function App() {
  const classes = useStyles()
  const [xVal, setXVal] = useState(0)
  const [showOverlay, setShowOverlay] = useState(true)
  const [yVal1, setYVal1] = useState(35)
  const [yVal2, setYVal2] = useState(50)

  const [activeNavStepIndex, setActiveNavStepIndex] = useState(0)

  const [subscriptionEnabled, setSubscriptionEnabled] = useState(false)
  const [savingPreset, setSavingPreset] = useState(false)
  const [breakdown1, setBreakdown1] = useState(null)
  const [breakdown2, setBreakdown2] = useState(null)
  const [totalCostAsPerc, setTotalCostAsPerc] = useState(null)
  function setPatientPresets(p) {
    patientPresets.current = p
    // console.log('todo - call momoizing functions')
  }
  function setTimePresets(p) {
    timePresets.current = p
    // console.log('todo - call momoizing functions')
  }

  const patientPresets = useRef(defaultPatientPresets)
  const timePresets = useRef(defaultTimePresets)

  const [view, setView] = React.useState('seg/patient')
  const activeView = useRef('seg/patient')

  function handlePatientPresetKeyTapped(index) {
    if (index < patientPresets.current.length) {
      handlePresetSelected(
        index,
        patientPresets.current[index],
        patientPresets.current
      )
    }
  }

  function handleTimePresetKeyTapped(index) {
    if (index < timePresets.current.length) {
      handlePresetSelected(
        index,
        timePresets.current[index],
        timePresets.current,
        'time'
      )
    }
  }

  function movePricePatientYUp() {
    const { min, max, keyStep } = sliderBounds.pricePatient.y
    const stepMultiplier = 2
    setYVal1(v =>
      v + keyStep * stepMultiplier > max ? max : v + keyStep * stepMultiplier
    )
  }

  function movePricePatientYDown() {
    const { min, max, keyStep } = sliderBounds.pricePatient.y
    const stepMultiplier = 2
    setYVal1(v =>
      v - keyStep * stepMultiplier < min ? min : v - keyStep * stepMultiplier
    )
  }

  function movePriceTimeYUp() {
    const { min, max, keyStep } = sliderBounds.priceTime.y
    setYVal2(v => (v + keyStep > max ? max : v + keyStep))
  }

  function movePriceTimeYDown() {
    const { min, max, keyStep } = sliderBounds.priceTime.y
    setYVal2(v => (v - keyStep < min ? min : v - keyStep))
  }

  // hotkeys used to load preset slider values
  useHotkeys('1, 2, 3, 4, 5, 6, 7, 8', params => {
    handleHotkeyTapped(params)
  })

  // hotkeys used to navigate charts
  useHotkeys(
    'up, down, left, right',
    e => {
      const { key } = e
      if (view === 'price/patient') {
        switch (key) {
          case 'ArrowUp': {
            movePricePatientYUp()
            break
          }
          case 'ArrowDown': {
            movePricePatientYDown()
            break
          }
          case 'ArrowLeft': {
            const { min, max, keyStep } = sliderBounds.pricePatient.x
            setXVal(v => (v - keyStep < min ? min : v - keyStep))
            break
          }
          case 'ArrowRight': {
            const { min, max, keyStep } = sliderBounds.pricePatient.x
            setXVal(v => (v + keyStep > max ? max : v + keyStep))
            break
          }

          default:
            break
        }
      } else if (view === 'price/time' && subscriptionEnabled) {
        switch (key) {
          case 'ArrowUp': {
            movePriceTimeYUp()
            break
          }
          case 'ArrowDown': {
            movePriceTimeYDown()
            break
          }

          default:
            break
        }
      }
      return false
    },
    [view, yVal1, yVal2, xVal, subscriptionEnabled]
  )

  function setNewActiveNavStep(step) {
    if (step < navSteps.length && step >= 0) {
      setActiveNavStepIndex(step)
    }
  }

  useHotkeys(
    'pageup, pagedown, enter, esc, e, ctrl+p',
    ({ key }) => {
      if (!(activeNavStepIndex in navSteps)) {
        return false
      }
      let dir = 1
      let baseKey = 'PageUp'

      if (/Escape|PageUp|p/.test(key)) {
        dir = -1
        // allow escape through if at beginning
        if (!activeNavStepIndex) {
          return true
        }
      } else if (/Enter|PageDown|e|E/.test(key)) {
        baseKey = 'PageDown'
        dir = 1
      } else {
        return false
      }

      const activeStepData = navSteps[activeNavStepIndex][baseKey]
      const newView = 'view' in activeStepData ? activeStepData.view : null
      const preset = 'preset' in activeStepData ? activeStepData.preset : null
      const overlay =
        'showOverlay' in activeStepData ? activeStepData.showOverlay : null

      const subscription =
        'subscription' in activeStepData ? activeStepData.subscription : null
      if (newView) {
        handleViewChange(null, newView)
      }
      if (typeof subscription === 'boolean') {
        setSubscriptionEnabled(subscription)
      }
      if (typeof overlay === 'boolean') {
        setShowOverlay(overlay)
      }
      if (!isNaN(preset)) {
        handleHotkeyTapped({ key: preset })
      }
      setNewActiveNavStep(activeNavStepIndex + dir)

      return false
    },
    [activeView.current, activeNavStepIndex, subscriptionEnabled]
  )

  function handleHotkeyTapped({ key }) {
    if (activeView.current === 'price/patient') {
      handlePatientPresetKeyTapped(Number.parseInt(key) - 1)
    } else if (activeView.current === 'price/time') {
      handleTimePresetKeyTapped(Number.parseInt(key) - 1)
    }
  }

  function handleSavePresetTapped() {
    setSavingPreset(true)
  }

  useEffect(() => {
    let newBreakdown1 = null

    switch (view) {
      case 'price/patient':
        newBreakdown1 = calculateBreakdown1({
          data: patientData,
          bounds,
          y: yVal1 * 1000,
          totalArea,
        })

        break
      case 'price/time':
        newBreakdown1 = calculateTimeBreakdown({
          dynamic: subscriptionEnabled,
          data: subscriptionEnabled
            ? priceTimeData.dynamic
            : priceTimeData.static,
          y: yVal2 * 0.01,
          totalArea: bounds.totalSegArea,
          cutOffX: null,
        })
        break
      case 'seg/time': {
        newBreakdown1 = {
          total: bounds.totalSegArea,
          bars: areaData,
        }
        break
      }
      default:
        newBreakdown1 = {
          total: bounds.totalSegArea,
          bars: areaData,
        }
        break
    }
    setBreakdown1(newBreakdown1)

    if (view === 'price/patient') {
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
        y: yVal1 * 1000,
        totalArea,
        breakdown1: newBreakdown1,
      })
      setBreakdown2(newBreakdown2)
      setTotalCostAsPerc(_.sumBy(newBreakdown2.bars, d => d.ratio))
    }
  }, [xVal, yVal1, yVal2, view, totalArea, subscriptionEnabled])

  const scrollHandler = useCallback(
    e => {
      const down = e.deltaY > 0
      if (activeView.current === 'price/patient') {
        e.preventDefault()
        if (down) {
          movePricePatientYDown()
        } else {
          movePricePatientYUp()
        }
      } else if (activeView.current === 'price/time') {
        e.preventDefault()
        if (down) {
          movePriceTimeYDown()
        } else {
          movePriceTimeYUp()
        }
      }

      return false
    },
    [yVal1, yVal2, activeView.current, subscriptionEnabled]
  )

  useEffect(() => {
    const persistedPatientPresets = getFromLocalStorage('presets')
    // new default presets might be longer
    if (
      persistedPatientPresets &&
      defaultPatientPresets.length > persistedPatientPresets.length
    ) {
      for (
        let i = persistedPatientPresets.length - 1;
        i < defaultPatientPresets.length - 1;
        i++
      ) {
        persistedPatientPresets.push(defaultPatientPresets[i])
      }
    }
    if (persistedPatientPresets) {
      setPatientPresets(persistedPatientPresets)
    }

    const persistedTimePresets = getFromLocalStorage('time')
    // new default presets might be longer
    if (
      persistedTimePresets &&
      defaultTimePresets.length > persistedTimePresets.length
    ) {
      for (
        let i = persistedTimePresets.length - 1;
        i < defaultTimePresets.length - 1;
        i++
      ) {
        persistedTimePresets.push(defaultTimePresets[i])
      }
    }
    if (persistedTimePresets) {
      setTimePresets(persistedTimePresets)
    }

    // todo - add scrollwheel event handlers
    if (typeof window !== 'undefined' && typeof scrollHandler === 'function') {
      window.addEventListener('wheel', scrollHandler, { passive: false })
    }

    return () => {
      if (
        typeof window !== 'undefined' &&
        typeof scrollHandler === 'function'
      ) {
        // remove event handlers
        window.removeEventListener('wheel', scrollHandler)
      }
    }
  }, [])

  const highlightedPriceAreaData =
    view === 'price/patient' ? getHighlightedArea(yVal1) : []

  const lastHighlightedVal =
    view === 'price/patient' &&
    highlightedPriceAreaData &&
    highlightedPriceAreaData.length
      ? _.last(highlightedPriceAreaData).xVal
      : 0
  const xPercOffset =
    view === 'price/patient' &&
    highlightedPriceAreaData &&
    highlightedPriceAreaData.length
      ? lastHighlightedVal / bounds.maxX
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

  function handleOverlayTapped() {
    if (!activeNavStepIndex) {
      setShowOverlay(false)
      setActiveNavStepIndex(1)
    }
  }

  function handleViewChange(event, newView) {
    if (newView) {
      activeView.current = newView
      setView(newView)
    }
    if (savingPreset) {
      setSavingPreset(false)
    }
  }

  function handlePresetSelected(
    i,
    { x, y },
    currentPresets,
    storageKey = 'presets'
  ) {
    if (savingPreset) {
      const newPresets = [...currentPresets]
      newPresets[i] = {
        label: null,
        x: xVal,
        y: activeView.current === 'price/patient' ? yVal1 : yVal2,
      }
      if (storageKey === 'presets') {
        setPatientPresets(newPresets)
      } else {
        setTimePresets(newPresets)
      }
      setSavingPreset(false)

      saveToLocalStorage(storageKey, newPresets)
    } else {
      setXVal(x)

      if (activeView.current === 'price/patient') {
        setYVal1(y)
      } else {
        setYVal2(y)
      }
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

  function getMainView({ dims }) {
    const { width, height } = dims
    switch (view) {
      case 'summary':
        const radialWidth = 200
        return (
          <SummaryWrap>
            <SummaryGrid height={height}>
              <div style={{ gridArea: 'h1', position: 'relative' }}>
                {false && (
                  <ContainerDimensions>
                    {({ width, height }) => {
                      return <SpanBracketSVG width={width} height={height} />
                    }}
                  </ContainerDimensions>
                )}
                <Typography variant="h3">Price per patient upfront</Typography>
              </div>
              <div style={{ gridArea: 'h2' }}>
                <Typography variant="h3">
                  Price per population over time
                </Typography>
              </div>
              <div style={{ gridArea: 'p1' }}>
                <div style={{ width: 200, margin: '0 auto' }}>
                  <RadialProgress
                    values={[14]}
                    max={100}
                    width={radialWidth}
                    height={radialWidth}
                    suffix={'%'}
                    title=""
                    colors={[areaColors[2], areaColors[3]]}
                    label={14}
                  />
                </div>
              </div>
              <div style={{ gridArea: 'p2' }}>
                <div style={{ width: 200, margin: '0 auto' }}>
                  <RadialProgress
                    values={[100]}
                    max={100}
                    width={radialWidth}
                    height={radialWidth}
                    suffix={'%'}
                    title=""
                    colors={[areaColors[2], areaColors[3]]}
                    label={100}
                  />
                </div>
              </div>
              <div style={{ gridArea: 'p3' }}>
                <div style={{ width: 200, margin: '0 auto' }}>
                  <RadialProgress
                    values={[42]}
                    max={100}
                    width={radialWidth}
                    height={radialWidth}
                    suffix={'%'}
                    title=""
                    colors={[areaColors[2], areaColors[3]]}
                    label={42}
                  />
                </div>
              </div>
              <div style={{ gridArea: 'p4', borderLeft: '2px solid white' }}>
                <div style={{ width: 200, margin: '0 auto' }}>
                  <RadialProgress
                    values={[94]}
                    max={100}
                    width={radialWidth}
                    height={radialWidth}
                    suffix={'%'}
                    title=""
                    colors={[areaColors[2], areaColors[3]]}
                    label={94}
                  />
                </div>
              </div>

              <div style={{ gridArea: 'c1' }}>
                <CostBreakdown
                  showLabels={true}
                  showValues={true}
                  align="center"
                  offsetForComplete={40}
                  height={height * 0.6}
                  width={width * 0.18}
                  scaleToBounds={1}
                  items={{
                    total: 2 * 1e9,
                    bars: [
                      {
                        key: 'Drug',
                        area: 1e9 * 0.5,
                        ratio: 0.25,
                      },
                      {
                        key: 'Hospital',
                        area: 1e9 * 0.7,
                        ratio: 0.35,
                      },
                      {
                        key: 'Saving',
                        area: 1e9 * 0.8,
                        ratio: 0.4,
                      },
                    ],
                  }}
                  colors={breakdownColorsPrice}
                  align="center"
                  title="Static Economics"
                />
              </div>
              <div style={{ gridArea: 'c2' }}>
                <CostBreakdown
                  showValues={true}
                  align="center"
                  offsetForComplete={40}
                  height={height * 0.6}
                  width={width * 0.18}
                  scaleToBounds={1}
                  items={{
                    total: 2 * 1e9,
                    bars: [
                      {
                        key: 'Drug',
                        area: 1e9 * 0.13,
                        ratio: 0.05,
                      },
                      {
                        key: 'Saving',
                        area: 1e9 * 1.9,
                        ratio: 0.95,
                      },
                    ],
                  }}
                  colors={[breakdownColorsPrice[0], breakdownColorsPrice[2]]}
                  align="center"
                  title="Low Price"
                />
              </div>
              <div style={{ gridArea: 'c3' }}>
                <CostBreakdown
                  showValues={true}
                  align="center"
                  offsetForComplete={40}
                  height={height * 0.6}
                  width={width * 0.18}
                  scaleToBounds={1}
                  items={{
                    total: 2 * 1e9,
                    bars: [
                      {
                        key: 'Drug',
                        area: 1e9 * 1.6,
                        ratio: 0.8,
                      },
                      {
                        key: 'Hospital',
                        area: 1e9 * 0.3,
                        ratio: 0.15,
                      },
                      {
                        key: 'Saving',
                        area: 1e9 * 0.1,
                        ratio: 0.05,
                      },
                    ],
                  }}
                  colors={breakdownColorsPrice}
                  align="center"
                  title="Spend to budget"
                />
              </div>
              <div style={{ gridArea: 'c4', borderLeft: '2px solid white' }}>
                <CostBreakdown
                  showValues={true}
                  align="center"
                  offsetForComplete={40}
                  height={height * 0.6}
                  width={width * 0.18}
                  scaleToBounds={1}
                  items={{
                    total: 2 * 1e9,
                    bars: [
                      {
                        key: 'Drug',
                        area: 1e9 * 0.8,
                        ratio: 0.4,
                      },
                      {
                        key: 'Hospital',
                        area: 1e9 * 0.3,
                        ratio: 0.15,
                      },
                      {
                        key: 'Saving',
                        area: 1e9 * 0.9,
                        ratio: 0.45,
                      },
                    ],
                  }}
                  colors={breakdownColorsPrice}
                  align="center"
                  title="Netflix for drugs"
                />
              </div>
            </SummaryGrid>
          </SummaryWrap>
        )
      case 'price/patient': {
        const margin = { top: 10, left: 80, right: 30, bottom: 120 }
        return (
          <DynamicChartViewWrap>
            <VerticalControls>
              <VerticalSlider
                min={sliderBounds.pricePatient.y.min}
                max={sliderBounds.pricePatient.y.max}
                step={sliderBounds.pricePatient.y.step}
                bounds={bounds}
                height={
                  ((height - (margin.top + margin.bottom)) * bounds.maxYInput) /
                  bounds.maxY
                }
                margin={`auto 0 ${-50 + margin.bottom}px 0`}
                onChange={(e, val) => {
                  if (e && e.target) {
                    e.target.blur()
                  }
                  setYVal1(val)
                  if (savingPreset) {
                    setSavingPreset(false)
                  }
                }}
                defaultValue={yVal1}
                valueLabelSuffix=""
                valueLabelDisplay="off"
              />
            </VerticalControls>
            <HorizontalControls>
              <HorizontalSlider
                min={sliderBounds.pricePatient.x.min}
                max={sliderBounds.pricePatient.x.max}
                step={sliderBounds.pricePatient.x.step}
                bounds={bounds}
                width={
                  (width - (100 + margin.left + margin.right)) *
                  (1 - xPercOffset)
                }
                margin={`0 ${margin.right}px 0 0`}
                onChange={(e, val) => {
                  if (e && e.target) {
                    e.target.blur()
                  }
                  setXVal(val)
                  if (savingPreset) {
                    setSavingPreset(false)
                  }
                }}
                defaultValue={xVal}
                valueLabelFormat={v =>
                  `${~~(
                    (v * 0.01 * (bounds.maxX - lastHighlightedVal)) / 1000 +
                    lastHighlightedVal / 1000
                  )}K`
                }
              />
            </HorizontalControls>
            <ChartWrap>
              <PricePatientChart
                areaColors={areaColors}
                view={view}
                bounds={bounds}
                patientData={patientData}
                highlightValues={{ x: xVal, y: yVal1 }}
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
              margin={{ top: 10, left: 180, right: 30, bottom: 120 }}
              height={height}
              data={patientData}
              bounds={bounds}
              colors={areaColors}
            />
          </StaticChartView>
        )
      case 'seg/time':
        return (
          <StaticChartView title={view} {...dims}>
            <SegTimeChart
              margin={{ top: 10, left: 180, right: 30, bottom: 120 }}
              height={height}
              data={segTimeData}
              bounds={bounds}
              cutOffX={null}
            />
          </StaticChartView>
        )
      case 'price/time': {
        const margin = { top: 10, left: 80, right: 30, bottom: 120 }
        const seriesData = createSeriesData({
          dynamic: subscriptionEnabled,
          cutOffX: null,
          data: subscriptionEnabled
            ? priceTimeData.dynamic
            : priceTimeData.static,
          perc: yVal2 * 0.01,
        })
        return (
          <DynamicChartViewWrap>
            <VerticalControls>
              <VerticalSlider
                min={sliderBounds.priceTime.y.min}
                max={sliderBounds.priceTime.y.max}
                step={sliderBounds.priceTime.y.step}
                valueLabelDisplay={'off'}
                defaultValue={yVal2}
                bounds={bounds}
                height={(height - (margin.bottom + margin.top)) * 0.325}
                margin={`auto 0 ${-50 + margin.bottom}px 0`}
                onChange={(e, val) => {
                  if (e && e.target) {
                    e.target.blur()
                  }
                  setYVal2(val)
                  if (savingPreset) {
                    setSavingPreset(false)
                  }
                }}
                valueLabelSuffix="%"
                enabled={subscriptionEnabled}
              />
            </VerticalControls>
            <HorizontalControls>
              <div />
            </HorizontalControls>
            <ChartWrap>
              <PriceTimeChart
                margin={margin}
                height={height}
                seriesData={seriesData}
                colors={areaColors}
                perc={yVal2 / 100}
                subscriptionEnabled={subscriptionEnabled}
              />
            </ChartWrap>
          </DynamicChartViewWrap>
        )
      }

      default:
        return <StaticChartView title={view} {...dims} />
    }
  }

  // const breakdownColumns =
  //   view === 'price/patient' && breakdown2 && xVal ? 2 : 1
  const breakdownColumns = 1
  return (
    <LayoutWrap hasSidebar={view !== 'summary'} hasHeader={view !== 'summary'}>
      <LayoutHeader>
        {view !== 'summary' && (
          <Typography variant="h1" gutterBottom>
            {getTitle({ view, subscriptionEnabled })}
          </Typography>
        )}
      </LayoutHeader>
      <LayoutSidebar>
        <ContainerDimensions>
          {({ width, height }) => {
            const breakdownWidth = width / breakdownColumns
            const showValues = view === 'price/patient' || view === 'price/time'
            return (
              breakdown1 && (
                <CostBreakdownWrap columns={breakdownColumns}>
                  {view !== 'price/patient' && view !== 'summary' && (
                    <CostBreakdown
                      showValues={showValues}
                      showLabels={true}
                      offsetForComplete={40}
                      height={height}
                      width={breakdownWidth}
                      scaleToBounds={1}
                      items={breakdown1}
                      colors={
                        view === 'price/time'
                          ? breakdownColorsPrice
                          : breakdownColorsTime
                      }
                      align="center"
                      title="Total 10 Year Cost"
                    />
                  )}
                  {view === 'price/patient' && breakdown2 && (
                    <CostBreakdown
                      showValues={showValues}
                      showLabels={true}
                      offsetForComplete={40}
                      height={height}
                      width={breakdownWidth}
                      scaleToBounds={totalCostAsPerc}
                      items={breakdown2}
                      colors={breakdownColorsPrice2}
                      align="center"
                      title={'Total 10 Year Cost'}
                    />
                  )}
                </CostBreakdownWrap>
              )
            )
          }}
        </ContainerDimensions>
        {view !== 'summary' && (
          <LayoutDial>
            {pie1 && view === 'price/patient' && (
              <RadialProgress
                values={pie1}
                max={100}
                width={250}
                height={250}
                suffix={'%'}
                title="Patients Cured"
                colors={[areaColors[2], areaColors[3]]}
                label={_.sum(pie1).toFixed(0)}
              />
            )}
            {view === 'price/time' && (
              <RadialProgress
                values={subscriptionEnabled ? [94] : [50]}
                max={100}
                width={250}
                height={250}
                suffix={'%'}
                title="Patients Cured"
                colors={[areaColors[2]]}
                label={subscriptionEnabled ? 94 : 50}
              />
            )}
          </LayoutDial>
        )}
      </LayoutSidebar>
      <LayoutMain>
        <ContainerDimensions>
          {dims => getMainView({ dims })}
        </ContainerDimensions>
      </LayoutMain>
      <LayoutFooter>
        <LayoutNav>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(e, newView) => {
              handleViewChange(e, newView)

              // when changing view via toggle, ensure a nearby nav step is activated
              // so pageup/pagedown navigation can continue from here
              switch (newView) {
                case 'price/patient':
                  setNewActiveNavStep(1)
                  break
                case 'price/time':
                  setNewActiveNavStep(11)
                  break
                case 'seg/time':
                  setNewActiveNavStep(10)
                  break
                case 'seg/patient':
                  setNewActiveNavStep(1)
                  break
                case 'summary':
                  setNewActiveNavStep(12)
                  break
              }
            }}
            className={classes.toggleButtonGroup}
          >
            <ToggleButton
              size="small"
              value="seg/patient"
              style={{ height: 40, gridArea: 'a' }}
            >
              <DeviceHubIcon />
              seg/patient
            </ToggleButton>
            <ToggleButton
              size="small"
              value="price/patient"
              style={{ height: 40, gridArea: 'b' }}
            >
              <TransformIcon />
              price/patient
            </ToggleButton>
            <ToggleButton
              size="small"
              value="seg/time"
              style={{ height: 40, gridArea: 'd' }}
            >
              <ViewColumnIcon />
              seg/time
            </ToggleButton>
            <ToggleButton
              size="small"
              value="price/time"
              style={{ height: 40, gridArea: 'e' }}
            >
              <VerticalAlignCenterIcon />
              price/time
            </ToggleButton>
            <ToggleButton
              size="small"
              value="summary"
              style={{ height: 80, gridArea: 'c', height: '100%' }}
            >
              <BarChartIcon />
              summary
            </ToggleButton>
          </ToggleButtonGroup>
          <SwitchWrap active={view === 'price/time'} on={subscriptionEnabled}>
            <label htmlFor="subscription">Product Per Patient</label>
            <Switch
              id="subscription"
              checked={subscriptionEnabled}
              onChange={(e, checked) => {
                if (e && e.target) {
                  e.target.blur()
                }
                setSubscriptionEnabled(checked)

                // try to keep keyboard nav state in sync with manual interactions
                if (checked) {
                  setNewActiveNavStep(8)
                } else {
                  setNewActiveNavStep(11)
                }
              }}
              value="enabled"
              color="primary"
            />
            <label
              htmlFor="subscription"
              style={{
                color: subscriptionEnabled
                  ? theme.palette.primary.light
                  : theme.palette.text.primary,
              }}
            >
              Subscription Per Population
            </label>
          </SwitchWrap>
        </LayoutNav>
        {view === 'price/patient' && (
          <PresetsWrap>
            <Presets
              storageKey="presets"
              items={patientPresets.current}
              labelFormatter={item => `$${item.y}k,+${item.x}%`}
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
        {view === 'price/time' && subscriptionEnabled && (
          <PresetsWrap>
            <Presets
              storageKey="time"
              items={timePresets.current}
              labelFormatter={item => `${item.y}%`}
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
      <Overlay show={showOverlay} onClick={handleOverlayTapped} />
    </LayoutWrap>
  )
}
