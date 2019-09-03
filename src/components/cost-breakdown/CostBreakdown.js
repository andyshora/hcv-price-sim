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
`
const Placeholder = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  opacity: 0;
`

const TitleWrap = styled.div`
  padding: ${props =>
    props.align === 'left' ? '1rem 0 0 1.5rem' : '1rem 1.8rem 0 0'};
  position: relative;
  left: 0;
  text-align: ${props => props.align};
  height: 120px;
  width: 100%;

  > h4 {
    font-size: 1.2rem;
  }
`

const ValueLabel = styled.text`
  // font-size: ${props =>
    props.val < 0.06 ? Math.max(1, 1.6 * (props.val / 0.1)) : 1.6}rem;
  font-size: 1.4rem;
  fill: white;
  width: ${props => props.width}px;

  > tspan {
    
  }
`

const TotalLabel = styled.text`
  font-size: 1.8rem;
  fill: white;
  width: 120px;

  > tspan {
    text-anchor: middle;
  }
`

function getRoundedCurrency({ val, billionsBeforeCapping = 10 }) {
  const valInBillions = val / 1e9
  let precision = valInBillions < billionsBeforeCapping ? 1 : 0
  if (valInBillions < 0.2) {
    precision = 2
  }
  const valAsCurrency = currency(valInBillions, {
    precision,
    symbol: '$',
    separator: '',
  })

  return `$${valAsCurrency.format()}B`
}

function getFormattedLabel({ text, style, x }) {
  if (text.length > 15) {
    const textArr = text.split(' ')
    const last = textArr.pop()
    return (
      <>
        <tspan x={x} dy={0} style={style}>
          {textArr.join(' ')}
        </tspan>
        <tspan x={x} dy={26} style={style}>
          {last}
        </tspan>
      </>
    )
  }
  return (
    <>
      <tspan style={style}>{text}</tspan>
    </>
  )
}

function getAdjustedLabelColor(color) {
  if (color === '#c41300') {
    return '#fd5240'
  } else if (color === 'rgba(111, 111, 111)') {
    return 'rgba(222, 222, 222)'
  }
  return color
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

  let positions = []
  let yOffset = SVGHeight

  let extraHeightOffsetForExcessScaling =
    200 * (Math.max(1.1, scaleToBounds) - 1.1)
  let adjustedHeight =
    SVGHeight -
    (offsetForComplete + Math.min(150, extraHeightOffsetForExcessScaling))

  // calculate label and bar positions
  for (let i = 0; i < items.bars.length; i++) {
    const ratio = items.bars[i].ratio

    const h = Math.max(0, adjustedHeight * ratio)
    positions.push({
      h,
      y: yOffset - h,
      yLabel: ratio > 0.7 ? yOffset - 50 : yOffset - h + h / 2 + 10,
      opacity: ratio < 0.02 ? 0 : 1,
    })
    yOffset -= h
  }

  let barPosX = align === 'left' ? 20 : width / 2

  const totalCost = getRoundedCurrency({
    val: items.total,
    billionsBeforeCapping: 1.9,
  })
  const barWidth = Math.min(80, width * 0.35)

  return (
    <BreakdownWrap height={height} paddingBottom={120}>
      <svg height={SVGHeight} width={width}>
        <g>
          {positions.map((p, i) => (
            <rect
              key={i}
              width={barWidth}
              height={p.h}
              x={barPosX}
              y={p.y}
              fill={colors[i]}
              mask={`url(#topFade)`}
            />
          ))}
        </g>
        <g>
          {positions.map((p, i) => {
            const showValue = /drug/i.test(items.bars[i].key)
            const labelPosX =
              align === 'left' ? barPosX + barWidth + 5 : barPosX - 5
            return (
              <React.Fragment key={items.bars[i].key}>
                <ValueLabel
                  width={100}
                  x={labelPosX}
                  y={Math.min(height, p.yLabel) - 25}
                  val={items.bars[i].ratio}
                  dy={0}
                >
                  {getFormattedLabel({
                    text: items.bars[i].key,
                    x: labelPosX,
                    style: {
                      fontSize: '1.6rem',
                      fillOpacity: p.opacity,
                      textAnchor: align === 'left' ? 'start' : 'end',
                      fill: getAdjustedLabelColor(colors[i]),
                    },
                  })}
                </ValueLabel>
                {showValue && (
                  <ValueLabel
                    key={i}
                    width={100}
                    x={labelPosX}
                    y={Math.min(height, p.yLabel)}
                    val={items.bars[i].ratio}
                  >
                    <tspan
                      style={{
                        fillOpacity: p.opacity,
                        textAnchor: align === 'left' ? 'start' : 'end',
                      }}
                    >
                      {getRoundedCurrency({ val: items.bars[i].area })}
                    </tspan>
                  </ValueLabel>
                )}
              </React.Fragment>
            )
          })}
        </g>
        <g>
          <TotalLabel
            x={barPosX + barWidth * 0.5}
            y={Math.max(30, _.last(positions).y - 15)}
          >
            <tspan>{totalCost}</tspan>
          </TotalLabel>
        </g>
        <defs>
          <mask id="topFade">
            <rect fill="white" width={width} height={height} x={0} y={0} />
            <path
              fill="black"
              d={`M 20 50 v -50 h ${barWidth} v 50 l ${-barWidth *
                0.5} -18 l ${-barWidth * 0.5} 18 z`}
            />
          </mask>
          <linearGradient id="gradTopFade" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="black" />
            <stop offset="100%" stopColor="white" />
          </linearGradient>
        </defs>
      </svg>
      {!!title && (
        <TitleWrap width={width} align={align}>
          <Typography variant="h5">{title}</Typography>
        </TitleWrap>
      )}
    </BreakdownWrap>
  )
}
