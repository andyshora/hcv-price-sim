import React from 'react'
import styled from 'styled-components'
import Slider from '@material-ui/core/Slider'
import { makeStyles, createStyles } from '@material-ui/styles'

const VerticalThumbWrap = styled.span`
  > span {
    position: absolute;
    height: 50px;
    width: 2000px;
    z-index: 10;
    left: 0;
    bottom: -7px;
    cursor: row-resize;
  }
`

const LineLabel = styled.div`
  position: absolute;
  left: 600px;
  top: -25px;
  font-size: 1.4rem;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);

  @media (min-width: 1200px) {
    left: 800px;
  }

  @media (min-width: 1400px) {
    left: 925px;
  }
`

function VerticalThumbComponent(props) {
  return (
    <VerticalThumbWrap {...props}>
      <span />
      <em>{props.children}</em>
      <LineLabel>Price</LineLabel>
    </VerticalThumbWrap>
  )
}

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      left: 92,
      zIndex: 10,
    },
    rail: {
      opacity: 0,
    },
    track: {
      opacity: 0,
    },
    thumb: {
      backgroundColor: 'white',
    },
    valueLabel: {
      left: -40,
      top: 0,
      '& *': {
        background: 'transparent',
        color: '#fff',
        fontStyle: 'normal',
        fontSize: '1.4rem',
      },
    },
  })
)

export default function VerticalSlider({
  lineLabel = null,
  onChange,
  height = 300,
  defaultValue = 1,
  enabled = true,
  min = 0,
  max = 100,
  step = 1,
  margin = '0',
  value = defaultValue,
  valueLabelSuffix = '',
  valueLabelDisplay = 'on',
}) {
  const classes = useStyles()
  return (
    <Slider
      classes={classes}
      orientation="vertical"
      valueLabelFormat={v => `${v}${valueLabelSuffix}`}
      valueLabelDisplay={valueLabelDisplay}
      onChange={onChange}
      min={min}
      max={max}
      step={step}
      value={value}
      defaultValue={defaultValue}
      ThumbComponent={VerticalThumbComponent}
      style={{
        height: `${height}px`,
        margin,
        transition: 'opacity 1s',
        opacity: +enabled,
      }}
    />
  )
}
