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
  top: 60px;
  left: 30px;
  color: white;
  font-size: 1.4rem;
`

function getSegmentData({ data, segment }) {
  const res = data
    .filter(d => d['Macro grouping'] === segment)
    .map(d => ({
      x: (d.Xcumsumleft + d.Xwidth / 2) / 1000,
      y: d.Yval / 1000,
    }))

  return res
}

function yTickFormat(val) {
  return `${val}K`
}

function xTickFormat(val) {
  return `${val}K`
}

export default function SegPatientChart({
  bounds,
  width = 800,
  height = 600,
  margin = { top: 80, left: 80, right: 80, bottom: 80 },
  data = [],
}) {
  return (
    <ChartWrap>
      <FlexibleWidthXYPlot
        height={height}
        yDomain={[0, bounds.maxY / 1000]}
        xDomain={[0, bounds.maxX / 1000]}
        margin={margin}
        stackBy="y"
      >
        <YAxis
          {...reactVizTheme.YAxis}
          style={{
            title: {
              display: 'none',
            },
          }}
          tickFormat={yTickFormat}
        />
        <XAxis
          title="Number of Patients"
          {...reactVizTheme.XAxis}
          tickTotal={5}
          tickFormat={xTickFormat}
        />

        {bounds.segments.map((s, i) => (
          <AreaSeries
            key={s}
            data={getSegmentData({
              data,
              segment: bounds.segments[i],
            })}
            curve="curveBasis"
            color={colorScales.jmi[i]}
            style={{ stroke: 'none', fillOpacity: 1 }}
          />
        ))}
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
    </ChartWrap>
  )
}
