import React, { useState } from 'react'
import styled from 'styled-components'
import theme, { colorScales, reactVizTheme } from '../../theme'

const XHighlightLabel = styled.div`
  position: absolute;
  right: -13.5rem;
  top: -5.5rem;
`

const YHighlightLabel = styled.div`
  position: absolute;
  right: 1rem;
  top: -5.5rem;
  background: rgba(0, 0, 0, 0.4);
`

export default function HighlightLegend({ labels, values }) {
  return (
    <>
      {!!labels.x && (
        <XHighlightLabel xVal={values.x}>{labels.x}</XHighlightLabel>
      )}
      {!!labels.y && (
        <YHighlightLabel xVal={values.x}>{labels.y}</YHighlightLabel>
      )}
    </>
  )
}
