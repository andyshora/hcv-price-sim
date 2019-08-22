import React, { useState } from 'react'
import theme, { reactVizTheme } from '../../theme'
import styled from 'styled-components'
import { Typography } from '@material-ui/core'

export default function CuredMeter({ value = 0 }) {
  return <Typography variant="h3">CuredMeter: {value}%</Typography>
}
