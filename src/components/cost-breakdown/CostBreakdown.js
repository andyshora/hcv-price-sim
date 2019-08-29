import React, { useState } from 'react'
import theme, { reactVizTheme } from '../../theme'
import styled from 'styled-components'
import { Typography } from '@material-ui/core'
import currency from 'currency.js'

const BreakdownWrap = styled.div``
const TotalCost = styled.div``

const Placeholder = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  opacity: 0;
`

const TitleWrap = styled.div`
  padding: 1rem;
  max-width: ${props => props.width}px;
  position: relative;
  left: -20px;

  > h4 {
    font-size: 1.2rem;
  }
`

const ValueLabel = styled.text`
  font-size: ${props =>
    props.val < 0.06 ? Math.max(1, 1.6 * (props.val / 0.1)) : 1.6}rem;
  fill: white;
`

export default function CostBreakdown({
  colors,
  items,
  height = 200,
  width = 140,
  offsetForComplete = 0,
  scaleToBounds = 1,
  totalCost = null,
  title = null,
  enabled = true,
}) {
  if (!enabled) {
    return <Placeholder width={width} height={height} />
  }
  let positions = []
  let yOffset = height

  let extraHeightOffsetForExcessScaling =
    200 * (Math.max(1.5, scaleToBounds) - 1.5)
  let adjustedHeight =
    height -
    (offsetForComplete + Math.min(150, extraHeightOffsetForExcessScaling))

  // calculate label and bar positions
  for (let i = 0; i < items.length; i++) {
    const h = Math.max(0, adjustedHeight * items[i])
    positions.push({
      h,
      y: yOffset - h,
      yLabel: items[i] > 0.7 ? yOffset - 50 : yOffset - h + h / 2 + 10,
      opacity: items[i] < 0.01 ? 0 : 1,
    })
    yOffset -= h
  }

  return (
    <BreakdownWrap>
      {totalCost && (
        <TotalCost>${currency(totalCost, { precision: 0 }).format()}</TotalCost>
      )}
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
              x={(width + 10) / 2}
              y={Math.min(height, p.yLabel)}
              val={items[i]}
            >
              <tspan style={{ fillOpacity: p.opacity }}>
                {(items[i] * 100).toFixed(0)}%
              </tspan>
            </ValueLabel>
          ))}
        </g>
      </svg>
      {!!title && (
        <TitleWrap width={width}>
          <Typography variant="h4">{title}</Typography>
        </TitleWrap>
      )}
    </BreakdownWrap>
  )
}
