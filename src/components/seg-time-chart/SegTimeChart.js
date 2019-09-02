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

function getFormattedData({ cutOffX, data }) {
  const mapped = data.map((d, i) => ({ x: i + 1, y: d / 1e6 }))
  return cutOffX ? _.slice(mapped, 0, 10) : mapped
}

function yTickFormat(val) {
  return `$${val / 1000}bn`
}

export default function SegTimeChart({
  bounds,
  width = 800,
  height = 600,
  margin = { top: 80, left: 80, right: 80, bottom: 80 },
  data = [],
  cutOffX = null,
}) {
  return (
    <ChartWrap>
      <FlexibleWidthXYPlot
        height={height}
        yDomain={[0, 8000]}
        xDomain={[1, cutOffX || 13]}
        margin={{ top: 50, right: 10, bottom: 100, left: 100 }}
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
        <XAxis title="Years" {...reactVizTheme.XAxis} tickTotal={13} />

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
    </ChartWrap>
  )
}
