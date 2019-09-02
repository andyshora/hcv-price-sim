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
  top: 80px;
  left: -90px;
  color: white;
  font-size: 1.4rem;
`

const HighlightedPriceRegion = styled.div`
  height: ${props => props.highlightValues.y * props.height}px;
  position: absolute;
  bottom: ${props => (props.margin ? props.margin.bottom : 0)}px;
  left: ${props => (props.margin ? props.margin.left : 0)}px;
  background: ${props =>
    props.dimensions === 1 ? 'none' : 'rgba(255, 255, 255, 0.05)'};
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
  return `${val}K`
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

  const chartAreaWidth = width - (margin.left + margin.right)
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

  return (
    <ChartWrap>
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

        {view === 'seg/patient' && (
          <DiscreteColorLegend
            style={{ fontSize: '1.2rem' }}
            items={bounds.segments.map((s, i) => ({
              title: s,
              color: colorScales.jmi[i],
              strokeWidth: 20,
            }))}
          />
        )}

        {view === 'seg/patient' &&
          bounds.segments.map((s, i) => (
            <AreaSeries
              key={s}
              data={getSegmentData({
                data: patientData,
                segment: bounds.segments[i],
              })}
              curve="curveBasis"
              color={colorScales.jmi[i]}
              style={{ stroke: 'none', fillOpacity: 1 }}
            />
          ))}

        {view === 'price/patient' && (
          <AreaSeries
            data={getFormattedData(patientData)}
            curve="curveBasis"
            color={areaColors[1]}
            style={{ stroke: 'none', fillOpacity: 1 }}
            // onNearestXY={onNearestXY}
          />
        )}

        {view === 'price/patient' && (
          <AreaSeries
            data={highlightedPriceAreaData}
            curve="curveBasis"
            color={areaColors[0]}
            style={{ stroke: 'none', fillOpacity: 1 }}
          />
        )}
        {view === 'price/patient' && (
          <AreaSeries
            data={highlightedSquareAreaData}
            curve="curveBasis"
            color={areaColors[2]}
            style={{ stroke: 'none', fillOpacity: 1 }}
          />
        )}
        {view === 'price/patient' && (
          <AreaSeries
            data={additionalCureAreaData}
            curve="curveBasis"
            color={areaColors[3]}
            style={{ stroke: 'none', fillOpacity: 1 }}
          />
        )}
        <YAxisLabel>
          Cost
          <br />
          Per
          <br />
          Patient
          <br />
          ($)
        </YAxisLabel>
      </FlexibleWidthXYPlot>

      {view === 'price/patient' && (
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
      )}
      {view === 'price/patient' && (
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
          margin={margin}
        />
      )}
    </ChartWrap>
  )
}
