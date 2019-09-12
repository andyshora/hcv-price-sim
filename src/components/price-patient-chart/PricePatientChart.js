import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import { FlexibleWidthXYPlot, XAxis, YAxis, AreaSeries } from 'react-vis'

import { reactVizTheme } from '../../theme'

const ChartWrap = styled.div`
  position: relative;
`

const YAxisLabel = styled.p`
  position: absolute;
  top: 60px;
  left: -70px;
  color: white;
  font-size: 1.4rem;
  user-select: none;
`

const HighlightedPriceRegion = styled.div`
  height: ${props => props.highlightValues.y * props.height}px;
  position: absolute;
  bottom: ${props => (props.margin ? props.margin.bottom : 0)}px;
  left: ${props => (props.margin ? props.margin.left : 0)}px;
  background: none;
  border-top: ${props =>
    props.highlightValues.y > 0 ? '1px dashed white' : 'none'};
  width: ${props => props.width}px;
`

const AdditionalCureRegion = styled.div`
  height: ${props => props.highlightValues.y * props.height}px;
  position: absolute;
  width: ${props => props.width}px;
  margin-left: ${props => props.offset}px;
  left: ${props => (props.margin ? props.margin.left : 0)}px;
  bottom: ${props => (props.margin ? props.margin.bottom : 0)}px;

  background: rgba(241, 117, 238, 0.6);
`

function getSquareHighlightedArea(data, { maxY }) {
  return data.length ? [{ x: 0, y: maxY }, { x: _.last(data).x, y: maxY }] : []
}

function getFormattedData(data) {
  const series = []

  for (let i = 0; i < data.length; i++) {
    const d = data[i]
    const y = d.Yval / 1000
    const x = d.Xcumsumleft / 1000

    // push start and end points so we have a flat bar
    series.push({ x, y })
    series.push({ x: d.Xcumsum / 1000, y })
  }

  return series
}

function getAdditionalCureAreaData(data, { minX, maxX, bounds }) {
  if (!maxX) {
    return []
  }
  const fract = maxX / 100
  const absMaxX = minX + (bounds.maxX - minX) * fract
  let filtered = data.filter(
    d => d.Xcumsumleft > minX && d.Xcumsumleft <= absMaxX
  )

  if (!filtered.length) {
    return []
  }

  // todo - if xWidth is large, this is causing the highlight overflow problem, as value tested is the left (start) value of the block
  // consider adding artificial values to split this up, as long as it doesnt affect breakdown calculation
  // split one rectange into 5

  const last = _.last(filtered)
  const diff = Math.abs(absMaxX - last.Xcumsum)
  const mightBeProtruding = last.Xwidth > 2000 && diff > 1200
  if (mightBeProtruding) {
    const largeEnd = filtered.pop()

    const numDivisions = 5
    const left = largeEnd.Xcumsumleft
    const distanceBetween = largeEnd.Xwidth
    const sliceWidth = distanceBetween / numDivisions

    const fractionBetween = (absMaxX - left) / distanceBetween
    const includeThreshold = _.round(fractionBetween / 2, 1) * 2

    _.times(numDivisions, i => {
      const elm = {
        Xcumsumleft: left,
        Xcumsum: left + (i + 1) * sliceWidth,
        Yval: largeEnd.Yval,
      }
      if (i / numDivisions <= includeThreshold) {
        filtered.push(elm)
      }
    })
  }

  const series = []

  for (let i = 0; i < filtered.length; i++) {
    const d = filtered[i]
    const y = to3dp(d.Yval * 1e-3)
    const x = to3dp(d.Xcumsumleft * 1e-3)

    // push start and end points so we have a flat bar
    series.push({ x, y })
    series.push({ x: to3dp(d.Xcumsum * 1e-3), y })
  }

  return series
}

function to3dp(num) {
  return +(Math.round(num + 'e+3') + 'e-3')
}

function yTickFormat(val) {
  return `$${val}K`
}

function xTickFormat(val) {
  return `${val}K`
}

export default function PricePatientChart({
  view = 'segments',
  bounds,
  highlightValues = { x: 0, y: 0 },
  highlightedPriceAreaData = [],
  width = 800,
  height = 600,
  margin = { top: 80, left: 80, right: 80, bottom: 80 },
  patientData = [],
  areaColors,
  plotProps = {},
  xDomain = null,
  yDomain = null,
}) {
  const highlightedSquareAreaData =
    view === 'price/patient'
      ? getSquareHighlightedArea(highlightedPriceAreaData, {
          maxY: highlightValues.y,
        })
      : []

  const chartAreaWidth = width - (margin.left + margin.right) - 100
  const chartAreaHeight = height - (margin.top + margin.bottom)

  const xDivider =
    view === 'price/patient' &&
    highlightedPriceAreaData &&
    highlightedPriceAreaData.length
      ? _.last(highlightedPriceAreaData).xVal
      : 0

  const curedRegionOffset = (xDivider / bounds.maxX) * chartAreaWidth

  const additionalCureAreaData =
    view === 'price/patient'
      ? getAdditionalCureAreaData(patientData, {
          minX: xDivider,
          maxX: highlightValues.x,
          bounds,
        })
      : []

  const additionalRegionWidth =
    (chartAreaWidth - curedRegionOffset) * highlightValues.x * 0.01

  return (
    <ChartWrap>
      <AdditionalCureRegion
        offset={curedRegionOffset}
        dimensions={view === 'price' ? 1 : 2}
        highlightValues={{
          x: highlightValues.x / 100,
          y: (highlightValues.y * 1000) / bounds.maxY,
        }}
        width={additionalRegionWidth}
        height={chartAreaHeight}
        margin={margin}
      />
      <FlexibleWidthXYPlot
        height={height}
        yDomain={yDomain || [0, bounds.maxY / 1000]}
        xDomain={xDomain || [0, bounds.maxX / 1000]}
        margin={margin}
        {...plotProps}
      >
        <YAxis
          title="Cost Per Patient"
          {...reactVizTheme.YAxis}
          tickTotal={6}
          tickFormat={yTickFormat}
          style={{
            title: {
              display: 'none',
            },
          }}
        />
        <XAxis
          title="Number of Patients"
          {...reactVizTheme.XAxis}
          tickTotal={5}
          tickFormat={xTickFormat}
        />

        <AreaSeries
          data={getFormattedData(patientData)}
          color={areaColors[1]}
          style={{ stroke: 'none', fillOpacity: 1 }}
          // onNearestXY={onNearestXY}
        />

        <AreaSeries
          data={getFormattedData(highlightedPriceAreaData)}
          color={areaColors[0]}
          style={{ stroke: 'none', fillOpacity: 1 }}
        />
        <AreaSeries
          data={highlightedSquareAreaData}
          color={areaColors[2]}
          style={{ stroke: 'none', fillOpacity: 1 }}
        />
        <AreaSeries
          data={additionalCureAreaData}
          color={areaColors[3]}
          style={{ stroke: 'none', fillOpacity: 1 }}
        />
        <YAxisLabel>
          Cost
          <br />
          Per
          <br />
          Patient
          <br />
        </YAxisLabel>
      </FlexibleWidthXYPlot>

      <HighlightedPriceRegion
        offset={curedRegionOffset}
        dimensions={view === 'price' ? 1 : 2}
        highlightValues={{
          x: highlightValues.x / 100,
          y: (highlightValues.y * 1000) / bounds.maxY,
        }}
        width={chartAreaWidth}
        height={chartAreaHeight}
        margin={margin}
      />
    </ChartWrap>
  )
}
