import React from 'react'
import styled from 'styled-components'
import Slider from '@material-ui/core/Slider'
import { makeStyles, createStyles } from '@material-ui/styles'

const HorizontalThumbWrap = styled.span`
  position: relative;
  > span {
    position: absolute;
    height: 2000px;
    width: 50px;
    z-index: 10;
    left: -6px;
    bottom: 0;
    cursor: col-resize;

    &:hover {
      background: linear-gradient(
        90deg,
        rgba(0, 0, 0, 0) 11px,
        rgb(255, 255, 255) 11px,
        #ffffff57 14px,
        rgba(0, 0, 0, 0) 14px
      );
    }
  }
`

function HorizontalThumbComponent(props) {
  return (
    <HorizontalThumbWrap {...props}>
      <span />
      <em>{props.children}</em>
    </HorizontalThumbWrap>
  )
}

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      bottom: 41,
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
      borderRadius: '50%',
    },
    valueLabel: {
      top: 46,
      '& *': {
        background: 'transparent',
        color: '#fff',
        fontStyle: 'normal',
        fontSize: '1.3rem',
        color: 'rgb(51, 229, 255)',
      },
    },
  })
)

const defaultValueLabelFormat = v => `+${v}%`

export default function HorizontalSlider({
  bounds,
  onChange,
  width = 300,
  margin = '0',
  defaultValue = 1,
  step = 1,
  min = 0,
  max = 100,
  enabled = true,
  value = defaultValue,
  valueLabelFormat = defaultValueLabelFormat,
  valueLabelDisplay = 'on',
  marks = true,
}) {
  const classes = useStyles()
  return (
    <Slider
      classes={classes}
      orientation="horizontal"
      valueLabelFormat={valueLabelFormat}
      valueLabelDisplay={valueLabelDisplay}
      onChange={onChange}
      min={min}
      max={max}
      value={value}
      step={marks && Array.isArray(marks) ? null : step}
      defaultValue={defaultValue}
      ThumbComponent={HorizontalThumbComponent}
      style={{
        margin,
        width: `${width}px`,
        transition: 'opacity 1s',
        opacity: +enabled,
      }}
    />
  )
}
