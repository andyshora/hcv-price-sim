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
  background: rgba(70, 164, 224, 0.67);
  border-top: ${props =>
    props.highlightValues.y > 0 ? '2px dashed white' : 'none'};
  width: ${props => props.highlightValues.x * props.width}px;
  height: ${props => props.highlightValues.y * props.height}px;
  position: absolute;
  bottom: 80px;
  left: 80px;
`

const XHighlightLabel = styled.label`
  position: absolute;
  right: -5rem;
  top: 3rem;
`

const YHighlightLabel = styled.label`
  position: absolute;

  right: 1rem;
  top: -3rem;
`

const myData = [
  { x: 0, x0: 1, y: 10, y0: 0 },
  { x: 1, x0: 2, y: 5, y0: 0 },
  { x: 2, x0: 4, y: 15, y0: 0 },
]

function getFormattedData(data) {
  return data.map(d => ({
    x: (d.Xcumsumleft + d.Xwidth / 2) / 1000,
    y: d.Yval / 1000,
  }))
}

function xTickFormat(val) {
  return `${val}k`
}

export default function SimGraph({
  bounds,
  highlightValues = { x: 0, y: 0 },
  width = 800,
  height = 600,
  margin = { top: 80, left: 80, right: 80, bottom: 80 },
  highlightLabels = { x: null, y: null },
  patientData = [],
}) {
  const formattedData = getFormattedData(patientData)

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

        <AreaSeries
          data={formattedData}
          curve="curveBasis"
          color={theme.palette.primary.light}
          style={{ stroke: 'none', fillOpacity: 1 }}
        />
      </XYPlot>

      <HighlightedRegion
        highlightValues={{
          x: (highlightValues.x * 1000) / bounds.maxX,
          y: (highlightValues.y * 1000) / bounds.maxY,
        }}
        width={width - (margin.left + margin.right)}
        height={height - (margin.top + margin.bottom)}
      >
        {!!highlightLabels.x && (
          <XHighlightLabel>
            <Typography variant="h3" component="h3">
              {highlightLabels.x}
            </Typography>
          </XHighlightLabel>
        )}
        {!!highlightLabels.y && (
          <YHighlightLabel>
            <Typography variant="h3" component="h3">
              {highlightLabels.y}
            </Typography>
          </YHighlightLabel>
        )}
      </HighlightedRegion>
    </ChartWrap>
  )
}
