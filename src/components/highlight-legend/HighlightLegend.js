import React, { useState } from 'react'
import styled from 'styled-components'
import theme, { colorScales, reactVizTheme } from '../../theme'

const yValSwitchThreshold = 150

const HighlightLabel = styled.div`
  position: absolute;
  right: 1rem;
  margin-top: ${props => (props.yVal > yValSwitchThreshold ? '11rem' : '0')};
`

const XHighlightLabel = styled(HighlightLabel)`
  top: -10.5rem;

  > div {
    color: ${props => props.color || 'inherit'};
  }
`

const YHighlightLabel = styled(HighlightLabel)`
  position: absolute;
  top: -5.5rem;
`

export default function HighlightLegend({ colors, labels, values }) {
  return (
    <>
      {!!labels.x && (
        <XHighlightLabel yVal={values.y} color={colors[1]}>
          {labels.x}
        </XHighlightLabel>
      )}
      {!!labels.y && (
        <YHighlightLabel yVal={values.y}>{labels.y}</YHighlightLabel>
      )}
    </>
  )
}
