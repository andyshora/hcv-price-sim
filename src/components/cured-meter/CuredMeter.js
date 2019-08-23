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
  const data = values.length
    ? values.map(v => ({
        angle0: 0,
        angle: 2 * Math.PI * v * 0.01,
        radius: 30,
        radius0: 0,
      }))
    : []
  return (
    <>
      <XYPlot width={100} height={100}>
        {data.length && values.length && !!values[0] && (
          <ArcSeries
            animation
            radiusType={'literal'}
            data={data}
            colorType={'literal'}
          />
        )}
      </XYPlot>
      {values.length && <p>{values.join(',')}</p>}
    </>
  )
}
