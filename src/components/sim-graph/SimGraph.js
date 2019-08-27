import React, { useState } from 'react'
import styled from 'styled-components'
import { Typography } from '@material-ui/core'
import _ from 'lodash'
import {
  XYPlot,
  FlexibleWidthXYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  LineSeries,
  AreaSeries,
  Crosshair,
  DiscreteColorLegend,
  GradientDefs,
  CustomSVGSeries,
  VerticalRectSeries,
} from 'react-vis'

import theme, { colorScales, reactVizTheme } from '../../theme'
import HighlightLegend from '../highlight-legend'

const ChartWrap = styled.div`
  position: relative;
`

const YAxisLabel = styled.p`
  position: absolute;
  top: 40px;
  left: -10px;
  color: white;
`

const HighlightedRegion = styled.div`
  height: ${props => props.highlightValues.y * props.height}px;
  position: absolute;
  bottom: 80px;
  left: 80px;
`

const HighlightedPriceRegion = styled(HighlightedRegion)`
  background: ${props =>
    props.dimensions === 1 ? 'none' : 'rgba(255, 255, 255, 0.05)'};
  border-top: ${props =>
    props.highlightValues.y > 0 ? '1px dashed white' : 'none'};
  width: ${props => props.width}px;
`

const AdditionalCureRegion = styled(HighlightedRegion)`
  width: ${props => props.width}px;
  margin-left: ${props => props.offset}px;

  background: rgba(249, 219, 47, 0.6);
  mix-blend-mode: saturation;
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

function getSegmentData({ data, segment }) {
  const res = data
    .filter(d => d['Macro grouping'] === segment)
    .map(d => ({
      x: (d.Xcumsumleft + d.Xwidth / 2) / 1000,
      y: d.Yval / 1000,
    }))

  return res
}

function getAdditionalCureAreaData(data, { minX, maxX, bounds }) {
  const fract = maxX / 100
  const absMaxX = minX + (bounds.maxX - minX) * fract
  const res = data
    .filter(d => d.Xcumsum > minX && d.Xcumsumleft <= absMaxX)
    .map(d => ({
      x: (d.Xcumsumleft + d.Xwidth / 2) / 1000,
      y: d.Yval / 1000,
    }))

  return res
}

function xTickFormat(val) {
  return `${val}k`
}

export default function SimGraph({
  view = 'segments',
  bounds,
  highlightValues = { x: 0, y: 0 },
  highlightedPriceAreaData = [],
  width = 800,
  height = 600,
  margin = { top: 80, left: 80, right: 80, bottom: 80 },
  patientData = [],
  areaColors,
}) {
  // function onNearestXY(value, { event, innerX, innerY, index }) {
  //   console.log('onNearestXY', value)
  // }

  const highlightedSquareAreaData =
    view !== 'segments'
      ? getSquareHighlightedArea(highlightedPriceAreaData, {
          maxY: highlightValues.y,
        })
      : []

  const chartAreaWidth = width - (margin.left + margin.right)
  const chartAreaHeight = height - (margin.top + margin.bottom)

  const xDivider =
    view !== 'segments' &&
    highlightedPriceAreaData &&
    highlightedPriceAreaData.length
      ? _.last(highlightedPriceAreaData).xVal
      : 0
  const curedRegionOffset = (xDivider / bounds.maxX) * chartAreaWidth

  const additionalCureAreaData =
    view !== 'segments'
      ? getAdditionalCureAreaData(patientData, {
          minX: xDivider,
          maxX: highlightValues.x,
          bounds,
        })
      : []

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

  if (highlightValues.x) {
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

  // console.log('highlightValues.x', highlightValues.x)

  return (
    <ChartWrap>
      <XYPlot
        width={width}
        height={height}
        yDomain={[0, bounds.maxY / 1000]}
        xDomain={[0, bounds.maxX / 1000]}
        margin={margin}
      >
        <YAxis
          title="Direct Cost Per Patient ($)"
          {...reactVizTheme.YAxis}
          tickFormat={xTickFormat}
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

        {view === 'segments' && (
          <DiscreteColorLegend
            style={{ fontSize: '1.2rem' }}
            items={bounds.segments.map((s, i) => ({
              title: s,
              color: colorScales.temperature(i / 3).css(),
              strokeWidth: 20,
            }))}
          />
        )}

        {view === 'segments' ? (
          bounds.segments.map((s, i) => (
            <AreaSeries
              key={s}
              data={getSegmentData({
                data: patientData,
                segment: bounds.segments[i],
              })}
              curve="curveBasis"
              color={colorScales.temperature(i / 3).css()}
              style={{ stroke: 'none', fillOpacity: 1 }}
            />
          ))
        ) : (
          <AreaSeries
            data={getFormattedData(patientData)}
            curve="curveBasis"
            color={areaColors[1]}
            style={{ stroke: 'none', fillOpacity: 1 }}
            // onNearestXY={onNearestXY}
          />
        )}

        {view !== 'segments' && (
          <AreaSeries
            data={highlightedPriceAreaData}
            curve="curveBasis"
            color={areaColors[0]}
            style={{ stroke: 'none', fillOpacity: 1 }}
          />
        )}
        {view !== 'segments' && (
          <AreaSeries
            data={highlightedSquareAreaData}
            curve="curveBasis"
            color={areaColors[2]}
            style={{ stroke: 'none', fillOpacity: 1 }}
          />
        )}
        {view !== 'segments' && (
          <AreaSeries
            data={additionalCureAreaData}
            curve="curveBasis"
            color={areaColors[3]}
            style={{ stroke: 'none', fillOpacity: 1 }}
          />
        )}
        <YAxisLabel>
          Direct Cost
          <br />
          Per Patient ($)
        </YAxisLabel>
      </XYPlot>

      {view !== 'segments' && (
        <HighlightedPriceRegion
          offset={curedRegionOffset}
          dimensions={view === 'price' ? 1 : 2}
          highlightValues={{
            x: highlightValues.x / 100,
            y: (highlightValues.y * 1000) / bounds.maxY,
          }}
          width={chartAreaWidth}
          height={chartAreaHeight}
        />
      )}
      {view !== 'segments' && (
        <AdditionalCureRegion
          offset={curedRegionOffset}
          dimensions={view === 'price' ? 1 : 2}
          highlightValues={{
            x: highlightValues.x / 100,
            y: (highlightValues.y * 1000) / bounds.maxY,
          }}
          width={
            (chartAreaWidth - curedRegionOffset) * highlightValues.x * 0.01
          }
          height={chartAreaHeight}
        />
      )}
      {view !== 'segments' && (
        <DiscreteColorLegend
          style={{
            fontSize: '1rem',
            padding: '0.5rem',
            top: -70,
            background: 'none',
            border: 'none',
          }}
          items={legendItems}
        />
      )}
    </ChartWrap>
  )
}
