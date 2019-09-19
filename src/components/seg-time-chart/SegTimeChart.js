import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import { FlexibleWidthXYPlot, XAxis, YAxis } from 'react-vis'
import VerticalBarSeries from '../bar-series/VerticalBarSeries'

import { colorScales, reactVizTheme } from '../../theme'

const ChartWrap = styled.div`
  position: relative;
`

const YAxisLabel = styled.p`
  position: absolute;
  top: 10px;
  left: 30px;
  color: white;
  font-size: 1.4rem;
  user-select: none;
`

function getFormattedData({ cutOffX, data }) {
  const mapped = data.map((d, i) => ({ x: i + 1, y: d / 1e6 }))
  return cutOffX ? _.slice(mapped, 0, 10) : mapped
}

function yTickFormat(val) {
  return `$${val}M`
}

export default function SegTimeChart({
  height = 600,
  margin = { top: 80, left: 80, right: 80, bottom: 80 },
  data = [],
  cutOffX = null,
}) {
  return (
    <ChartWrap>
      <FlexibleWidthXYPlot
        height={height}
        yDomain={[0, 350]}
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

        <VerticalBarSeries
          data={getFormattedData({ data: data[0], cutOffX })}
          color={colorScales.jmi[3]}
        />
        <VerticalBarSeries
          data={getFormattedData({ data: data[1], cutOffX })}
          color={colorScales.jmi[2]}
        />
        <VerticalBarSeries
          data={getFormattedData({ data: data[2], cutOffX })}
          color={colorScales.jmi[1]}
        />
        <VerticalBarSeries
          data={getFormattedData({ data: data[3], cutOffX })}
          color={colorScales.jmi[0]}
        />
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
