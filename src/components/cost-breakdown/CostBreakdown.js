import React, { useState } from 'react'
import theme, { reactVizTheme } from '../../theme'
import styled from 'styled-components'
import { Typography } from '@material-ui/core'

const BreakdownWrap = styled.div`
  padding: 1rem;
`

const ValueLabel = styled.text`
  font-size: ${props =>
    props.val < 0.1 ? Math.max(1, 2 * (props.val / 0.1)) : 2}rem;
  fill: white;
`

export default function CostBreakdown({
  colors,
  items,
  height = 200,
  width = 160,
  offsetForComplete = 0,
}) {
  let positions = []
  let yOffset = height
  let adjustedHeight = height - offsetForComplete
  for (let i = 0; i < items.length; i++) {
    const h = adjustedHeight * items[i]

    positions.push({
      h,
      y: yOffset - h,
      yLabel: items[i] > 0.7 ? yOffset - 50 : yOffset - h + h / 2 + 10,
    })
    yOffset -= h
  }
  return (
    <BreakdownWrap>
      <svg height={height} width={width}>
        <g>
          {positions.map((p, i) => (
            <rect
              key={i}
              width={width / 2}
              height={p.h}
              x={0}
              y={p.y}
              fill={colors[i]}
            />
          ))}
        </g>
        <g>
          {positions.map((p, i) => (
            <ValueLabel
              key={i}
              x={(width + 20) / 2}
              y={p.yLabel}
              val={items[i]}
            >
              <tspan>{(items[i] * 100).toFixed(0)}%</tspan>
            </ValueLabel>
          ))}
        </g>
      </svg>
    </BreakdownWrap>
  )
}
