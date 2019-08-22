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

const ChartWrap = styled.div`
  position: relative;
`

// todo - derive these
const heightMultiplier = 4.4
const widthMultiplier = 8

const HighlightedRegion = styled.div`
  background: ${props =>
    props.dimensions === 1 ? 'none' : 'rgba(255, 255, 255, 0.05)'};
  border-top: ${props =>
    props.highlightValues.y > 0 ? '1px dashed white' : 'none'};
  width: ${props => props.offset + props.highlightValues.x * props.width}px;
  height: ${props => props.highlightValues.y * props.height}px;
  position: absolute;
  bottom: 80px;
  left: 80px;
`

const XHighlightLabel = styled.div`
  position: absolute;
  right: -13.5rem;
  top: -5.5rem;
`

const YHighlightLabel = styled.div`
  position: absolute;
  right: 1rem;
  top: -5.5rem;
`

const myData = [
  { x: 0, x0: 1, y: 10, y0: 0 },
  { x: 1, x0: 2, y: 5, y0: 0 },
  { x: 2, x0: 4, y: 15, y0: 0 },
]

function getHighlightedArea(data, { maxY }) {
  const res = data
    .filter(d => d.Yval / 1000 >= maxY)
    .map(d => ({
      x: (d.Xcumsumleft + d.Xwidth / 2) / 1000,
      y: d.Yval / 1000,
    }))

  return res
}

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
  highlightLabels = { x: null, y: null },
  patientData = [],
  areaColors,
}) {
  function onNearestXY(value, { event, innerX, innerY, index }) {
    // console.log('onNearestXY', value)
  }

  console.log('highlightValues', highlightValues.x)

  const highlightedSquareAreaData =
    view !== 'segments'
      ? getSquareHighlightedArea(highlightedPriceAreaData, {
          maxY: highlightValues.y,
        })
      : []

  const xDivider = _.last(highlightedPriceAreaData).xVal
  const secondHighlightOffset =
    (xDivider / bounds.maxX) * (width - (margin.left + margin.right))

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
          title="Direct Cost Per Patient"
          {...reactVizTheme.YAxis}
          tickFormat={xTickFormat}
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
      </XYPlot>

      {view !== 'segments' && (
        <HighlightedRegion
          offset={secondHighlightOffset}
          dimensions={view === 'price' ? 1 : 2}
          highlightValues={{
            x: highlightValues.x / 100,
            y: (highlightValues.y * 1000) / bounds.maxY,
          }}
          width={width - (margin.left + margin.right) - secondHighlightOffset}
          height={height - (margin.top + margin.bottom)}
        >
          {!!highlightLabels.x && (
            <XHighlightLabel>{highlightLabels.x}</XHighlightLabel>
          )}
          {!!highlightLabels.y && (
            <YHighlightLabel>{highlightLabels.y}</YHighlightLabel>
          )}
        </HighlightedRegion>
      )}
    </ChartWrap>
  )
}
