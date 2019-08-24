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
  ArcSeries,
  AreaSeries,
  Crosshair,
  DiscreteColorLegend,
  GradientDefs,
  CustomSVGSeries,
  VerticalRectSeries,
} from 'react-vis'

import theme, { colorScales, reactVizTheme } from '../../theme'

export default function CuredMeter({ values = [] }) {
  const seriesData = []
  let angle0 = 0

  for (let i = 0; i < values.length; i++) {
    const v = values[i]
    const angle = 2 * Math.PI * v * 0.01
    seriesData.push({
      angle0,
      angle,
      radius: 30,
      radius0: 0,
    })
    angle0 += angle
  }

  return (
    <>
      <XYPlot width={100} height={100}>
        {seriesData.length && (
          <ArcSeries
            animation
            radiusType={'literal'}
            data={seriesData}
            colorType={'literal'}
          />
        )}
      </XYPlot>
      {values.length && <p>data: {values.join(',')}</p>}
    </>
  )
}
