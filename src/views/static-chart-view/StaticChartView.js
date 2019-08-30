import React from 'react'
import styled from 'styled-components'
import { Paper, Typography } from '@material-ui/core'

const ViewWrap = styled.section`
  //   background: hotpink;
`

export default function StaticChartView({ children, width, height }) {
  return <ViewWrap style={{ width: '100%', height }}>{children}</ViewWrap>
}
