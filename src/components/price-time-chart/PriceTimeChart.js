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
  top: 80px;
  left: -90px;
  color: white;
  font-size: 1.4rem;
`

const HighlightedRegion = styled.div`
  height: ${props => props.perc * props.height}px;
  position: absolute;
  bottom: ${props => (props.margin ? props.margin.bottom : 0)}px;
  left: ${props => (props.margin ? props.margin.left : 0)}px;
  background: ${props =>
    props.dimensions === 1 ? 'none' : 'rgba(255, 255, 255, 0.05)'};
  border-top: ${props => (props.perc > 0 ? '1px dashed white' : 'none')};
  width: ${props => props.width}px;
`

function getFormattedData(data) {
  return data.map((d, i) => ({ x: i + 1, y: d / 1e6 }))
}

function createSeriesData({ cutOffX, data, perc = 0.2 }) {
  const res = {
    hospital: [],
    drug: [],
    savings: [],
  }
  const maxLen = cutOffX || data.total.length
  for (let i = 0; i < maxLen; i++) {
    const total = data.total[i] / 1e6
    const hospital = data.hospital[i] / 1e6
    const hospitalElm = { x: i + 1, y: hospital }
    const drugElm = {
      x: i + 1,
      y: i > 9 ? data.drugEnd[i - 10] / 1e6 : perc * total,
    }
    const savingsElm = { x: i + 1, y: total - (hospitalElm.y + drugElm.y) }
    res.hospital.push(hospitalElm)
    res.drug.push(drugElm)
    res.savings.push(savingsElm)
  }

  return res
}

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
  return `$${val / 1000}bn`
}

export default function PriceTimeChart({
  bounds,
  colors,
  width = 800,
  height = 600,
  margin = { top: 80, left: 80, right: 80, bottom: 80 },
  data = [],
  perc = 0,
  cutOffX = null,
}) {
  const seriesData = createSeriesData({ cutOffX, data, perc })

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

        <VerticalBarSeries data={seriesData.drug} color={colors[2]} />
        <VerticalBarSeries data={seriesData.hospital} color={colors[1]} />
        <VerticalBarSeries data={seriesData.savings} color={colors[0]} />

        <LineSeries
          color="white"
          data={createLineData(seriesData.drug)}
          strokeStyle="dashed"
        />
      </FlexibleWidthXYPlot>
    </ChartWrap>
  )
}
