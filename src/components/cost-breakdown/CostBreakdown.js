import React from 'react'
import styled from 'styled-components'
import { Typography } from '@material-ui/core'
import currency from 'currency.js'
import _ from 'lodash'

const BreakdownWrap = styled.div`
  height: ${props => props.height}px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  flex-direction: column;

  > svg {
  }
`
const TotalCost = styled.div``

const Placeholder = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  opacity: 0;
`

const TitleWrap = styled.div`
  padding: 1rem 0 0 0;
  position: relative;
  left: 0;
  text-align: ${props => props.align};
  background: hotpink;
  height: 80px;

  > h4 {
    font-size: 1.2rem;
  }
`

const ValueLabel = styled.text`
  font-size: ${props =>
    props.val < 0.06 ? Math.max(1, 1.6 * (props.val / 0.1)) : 1.6}rem;
  fill: white;
  width: ${props => props.width}px;

  > tspan {
    text-anchor: middle;
  }
`

const TotalLabel = styled.text`
  font-size: 1.6rem;
  fill: white;

  > tspan {
    text-anchor: middle;
  }
`

function getRoundedCurrency(val) {
  const valInBillions = val / 1e9
  const precision = valInBillions < 10 ? 1 : 0
  const valAsCurrency = currency(valInBillions, {
    precision,
    symbol: '$',
    separator: '',
  })

  return `$${valAsCurrency.format()}bn`
}

export default function CostBreakdown({
  colors,
  items,
  height = 200,
  width = 140,
  offsetForComplete = 0,
  scaleToBounds = 1,
  title = null,
  enabled = true,
  align = 'left',
}) {
  if (!enabled) {
    return <Placeholder width={width} height={height} />
  }

  const SVGHeight = height - 150

  const layoutItems = items.ratios
  const labelItems = items.areas
  let positions = []
  let yOffset = SVGHeight

  let extraHeightOffsetForExcessScaling =
    200 * (Math.max(1.5, scaleToBounds) - 1.5)
  let adjustedHeight =
    SVGHeight -
    (offsetForComplete + Math.min(150, extraHeightOffsetForExcessScaling))

  // calculate label and bar positions
  for (let i = 0; i < layoutItems.length; i++) {
    const h = Math.max(0, adjustedHeight * layoutItems[i])
    positions.push({
      h,
      y: yOffset - h,
      yLabel: layoutItems[i] > 0.7 ? yOffset - 50 : yOffset - h + h / 2 + 10,
      opacity: layoutItems[i] < 0.01 ? 0 : 1,
    })
    yOffset -= h
  }

  let labelPosX = align === 'left' ? 0 : width / 2
  let barPosX = align === 'left' ? 0 : width / 2

  const totalCost = getRoundedCurrency(_.sum(items.areas))

  return (
    <BreakdownWrap height={height}>
      <svg height={SVGHeight} width={width}>
        <g>
          <rect
            width={width * 0.4 + 20}
            height={adjustedHeight + 20}
            x={barPosX - 10}
            y={SVGHeight - adjustedHeight - 10}
            fill="rgba(0, 0, 0, 0.5)"
          />
          <TotalLabel
            x={barPosX + width * 0.2}
            y={SVGHeight - adjustedHeight - 15}
          >
            <tspan>{totalCost}</tspan>
          </TotalLabel>
        </g>
        <g>
          {positions.map((p, i) => (
            <rect
              key={i}
              width={width * 0.4}
              height={p.h}
              x={barPosX}
              y={p.y}
              fill={colors[i]}
            />
          ))}
        </g>
        <g>
          {positions.map((p, i) => (
            <ValueLabel
              key={i}
              width={width * 0.4}
              x={
                align === 'left' ? barPosX + width * 0.6 : barPosX - width * 0.2
              }
              y={Math.min(height, p.yLabel)}
              val={layoutItems[i]}
            >
              <tspan style={{ fillOpacity: p.opacity }}>
                {getRoundedCurrency(labelItems[i])}
              </tspan>
            </ValueLabel>
          ))}
        </g>
      </svg>
      {!!title && false && (
        <TitleWrap width={width} align={'center'}>
          <Typography variant="h4">{title}</Typography>
        </TitleWrap>
      )}
    </BreakdownWrap>
  )
}
