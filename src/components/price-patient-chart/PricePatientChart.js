import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import {
  FlexibleWidthXYPlot,
  XAxis,
  YAxis,
  AreaSeries,
  DiscreteColorLegend,
  VerticalBarSeries,
} from 'react-vis'

import { colorScales, reactVizTheme } from '../../theme'

const ChartWrap = styled.div`
  position: relative;
`

const YAxisLabel = styled.p`
  position: absolute;
  top: 40px;
  left: -70px;
  color: white;
  font-size: 1.4rem;
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

  background: rgba(249, 219, 47, 0.6);
  // mix-blend-mode: saturation;
`

function getSquareHighlightedArea(data, { maxY }) {
  return data.length ? [{ x: 0, y: maxY }, { x: _.last(data).x, y: maxY }] : []
}

function getFormattedData(data) {
  return data.map(d => ({
    x: (d.Xcumsumleft + d.Xwidth / 2) / 1000,
    y: d.Yval / 1000,
  }))
}

function getAdditionalCureAreaData(data, { minX, maxX, bounds }) {
  const fract = maxX / 100
  const absMaxX = minX + (bounds.maxX - minX) * fract
  const res = data
    .filter(d => d.Xcumsum > minX && d.Xcumsumleft <= absMaxX)
    .map(d => ({
      x: d.Xcumsum / 1000,
      y: d.Yval / 1000,
    }))

  return res
}

function yTickFormat(val) {
  return `${val}`
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
      ? _.last(highlightedPriceAreaData).xLeft
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
          title="Cost Per Patient ($)"
          {...reactVizTheme.YAxis}
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
          curve="curveBasis"
          color={areaColors[1]}
          style={{ stroke: 'none', fillOpacity: 1 }}
          // onNearestXY={onNearestXY}
        />

        <AreaSeries
          data={highlightedPriceAreaData}
          curve="curveBasis"
          color={areaColors[0]}
          style={{ stroke: 'none', fillOpacity: 1 }}
        />
        <AreaSeries
          data={highlightedSquareAreaData}
          curve="curveBasis"
          color={areaColors[2]}
          style={{ stroke: 'none', fillOpacity: 1 }}
        />
        <AreaSeries
          data={additionalCureAreaData}
          curve="curveBasis"
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
          ($K)
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
