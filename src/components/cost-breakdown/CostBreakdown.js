import React, { useState } from 'react'
import theme, { reactVizTheme } from '../../theme'
import styled from 'styled-components'
import { Typography } from '@material-ui/core'

const BreakdownWrap = styled.div`
  padding: 1rem;
`

const ValueLabel = styled.text`
  font-size: ${props => (props.val < 0.12 ? 2 * (props.val / 0.12) : 2)}rem;
  fill: black;
  opacity: ${props => (props.val < 0.05 ? 0 : 1)};
`

export default function CostBreakdown({
  areaColors,
  items,
  height = 200,
  width = 180,
}) {
  let positions = []
  let cumH = 0
  for (let i = 0; i < items.length; i++) {
    const h = height * items[i]
    positions.push({ h, y: cumH })
    cumH += h
  }
  return (
    <BreakdownWrap>
      <svg height={height} width={width}>
        <g>
          {positions.map((p, i) => (
            <rect
              key={i}
              width={width}
              height={p.h}
              x={0}
              y={p.y}
              fill={areaColors[i]}
            />
          ))}
        </g>
        <g>
          {positions.map((p, i) => (
            <ValueLabel
              key={i}
              x={width - 80}
              y={p.y + p.h / 2 + 10}
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
