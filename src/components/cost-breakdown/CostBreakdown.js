import React, { useState } from 'react'
import theme, { reactVizTheme } from '../../theme'
import styled from 'styled-components'
import { Typography } from '@material-ui/core'

export default function CostBreakdown({
  areaColors,
  items,
  height = 200,
  width = 500,
}) {
  let positions = []
  let cumH = 0
  for (let i = 0; i < items.length; i++) {
    const h = height * items[i]
    positions.push({ h, y: cumH })
    cumH += h
  }
  return (
    <div>
      <p>{items.join(',')}</p>
      <svg height={height} width={width}>
        <g>
          {positions.map((p, i) => {
            return (
              <rect
                key={i}
                width={width}
                height={p.h}
                x={0}
                y={p.y}
                fill={areaColors[i]}
              />
            )
          })}
        </g>
      </svg>
    </div>
  )
}
