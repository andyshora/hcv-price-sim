import React, { useState } from 'react'
import styled from 'styled-components'
import { Typography } from '@material-ui/core'

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
  border-top: 2px dashed white;
  width: ${props => props.highlightDimensions.x * props.width}px;
  height: ${props => props.highlightDimensions.y * props.height}px;
  position: absolute;
  bottom: 80px;
  left: 80px;

  > label {
    position: absolute;
    right: 1rem;
    top: -3rem;
  }
`

const data = [
  { x: 0, y: 100 },
  { x: 1, y: 30 },
  { x: 2, y: 10 },
  { x: 3, y: 5 },
]

export default function SimGraph({
  highlightDimensions = { x: 0, y: 0 },
  width = 800,
  height = 600,
  margin = { top: 80, left: 80, right: 80, bottom: 80 },
  highlightLabel = '',
}) {
  return (
    <ChartWrap>
      <XYPlot width={width} height={height} yDomain={[0, 100]} margin={margin}>
        <HorizontalGridLines />
        <VerticalGridLines />

        <YAxis title="Direct Cost Per Patient" />
        <XAxis title="Price ($)" />

        <DiscreteColorLegend
          items={[
            {
              title: 'Asset A',
              color: 'url(#stripes)',
              strokeWidth: 10,
            },
          ]}
        />
        <AreaSeries
          data={data}
          curve="curveBasis"
          color="url(#stripes)"
          style={{ stroke: 'none', fillOpacity: 1 }}
        />
        <GradientDefs>
          {reactVizTheme.SVG.patterns.createStripePattern({
            fill: theme.palette.series[0],
            id: 'stripes',
          })}
          <linearGradient id="OptimisedMeanGrad" x1="0" x2="1" y1="0" y2="0">
            <stop
              offset="0%"
              stopColor={theme.palette.primary.light}
              stopOpacity={0}
            />
            <stop
              offset="100%"
              stopColor={theme.palette.primary.light}
              stopOpacity={0.1}
            />
          </linearGradient>
        </GradientDefs>
      </XYPlot>

      <HighlightedRegion
        highlightDimensions={highlightDimensions}
        width={width - (margin.left + margin.right)}
        height={height - (margin.top + margin.bottom)}
        highlightLabel={highlightLabel}
      >
        {!!highlightLabel && (
          <Typography variant="h3" component="label">
            {highlightLabel}
          </Typography>
        )}
      </HighlightedRegion>
    </ChartWrap>
  )
}
