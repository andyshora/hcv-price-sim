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
  LineSeries,
} from 'react-vis'

import { colorScales, reactVizTheme } from '../../theme'

const ChartWrap = styled.div`
  position: relative;
`

const YAxisLabel = styled.p`
  position: absolute;
  top: 60px;
  left: -70px;
  color: white;
  font-size: 1.4rem;
`

function createLineData(data) {
  let arr = []
  for (let i = 0; i < data.length; i++) {
    arr.push({ x: data[i].x - 0.4, y: data[i].y })
    arr.push({ x: data[i].x, y: data[i].y })
    arr.push({ x: data[i].x + 0.4, y: data[i].y })
  }

  return arr
}
function yTickFormat(val) {
  return `$${val}M`
}

export default function PriceTimeChart({
  colors,
  height = 600,
  margin = { top: 80, left: 80, right: 80, bottom: 80 },
  cutOffX = null,
  seriesData = null,
  subscriptionEnabled = false,
}) {
  return (
    <ChartWrap>
      <FlexibleWidthXYPlot
        height={height}
        yDomain={[0, 400]}
        xDomain={[1, cutOffX || 10]}
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
          tickTotal={6}
        />
        <XAxis title="Year" {...reactVizTheme.XAxis} tickTotal={10} />

        <VerticalBarSeries data={seriesData.drug} color={colors[2]} />
        <VerticalBarSeries data={seriesData.hospital} color={colors[1]} />
        <VerticalBarSeries data={seriesData.savings} color={colors[0]} />

        {subscriptionEnabled && (
          <LineSeries
            color="white"
            data={createLineData(seriesData.drug)}
            strokeStyle="dashed"
          />
        )}
      </FlexibleWidthXYPlot>
      <YAxisLabel>
        Total
        <br />
        Cost
        <br />
      </YAxisLabel>
    </ChartWrap>
  )
}
