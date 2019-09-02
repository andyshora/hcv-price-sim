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
    root: {},
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
      top: 50,
      '& *': {
        background: 'transparent',
        color: '#fff',
        fontStyle: 'normal',
        fontSize: '1.4rem',
      },
    },
  })
)

export default function HorizontalSlider({
  bounds,
  onChange,
  width = 300,
  margin = '0',
  defaultValue = 1,
  enabled = true,
  value = defaultValue,
}) {
  const classes = useStyles()
  return (
    <Slider
      classes={classes}
      orientation="horizontal"
      valueLabelFormat={v => `+${v}%`}
      valueLabelDisplay="on"
      onChange={onChange}
      min={0}
      max={100}
      value={value}
      step={1}
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
