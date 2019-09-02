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

    &:hover {
      background: linear-gradient(
        0deg,
        rgba(0, 0, 0, 0) 11px,
        rgb(255, 255, 255) 11px,
        #ffffff57 13px,
        rgba(0, 0, 0, 0) 13px
      );
      // mix-blend-mode: color;
    }
  }
`

function VerticalThumbComponent(props) {
  return (
    <VerticalThumbWrap {...props}>
      <span />
      <em>{props.children}</em>
    </VerticalThumbWrap>
  )
}

const useStyles = makeStyles(theme =>
  createStyles({
    root: {},
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
}) {
  const classes = useStyles()
  return (
    <Slider
      classes={classes}
      orientation="vertical"
      valueLabelFormat={v => `${v}${valueLabelSuffix}`}
      valueLabelDisplay="on"
      onChange={onChange}
      min={min}
      max={max}
      step={step}
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
