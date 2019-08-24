import React from 'react'
import styled from 'styled-components'
import Slider from '@material-ui/core/Slider'
import theme from '../../theme'

const HorizontalThumbWrap = styled.span`
  > span {
    position: absolute;
    height: 2000px;
    width: 50px;
    z-index: 10;
    left: -7px;
    bottom: 0;
    cursor: col-resize;

    &:hover {
      background: linear-gradient(
        90deg,
        rgba(0, 0, 0, 0) 11px,
        ${theme.palette.primary.light} 11px,
        #ffffff57 13px,
        rgba(0, 0, 0, 0) 13px
      );
      mix-blend-mode: color;
    }
  }
`

function HorizontalThumbComponent(props) {
  return (
    <HorizontalThumbWrap {...props}>
      <span />
    </HorizontalThumbWrap>
  )
}

export default function HorizontalSlider({
  bounds,
  onChange,
  width = 300,
  margin = '0',
  defaultValue = 1,
  enabled = true,
}) {
  return (
    <Slider
      orientation="horizontal"
      valueLabelFormat={v => `${v}`}
      valueLabelDisplay="auto"
      onChange={onChange}
      min={0}
      max={100}
      step={1}
      defaultValue={defaultValue}
      ThumbComponent={HorizontalThumbComponent}
      style={{
        margin: `${margin}px`,
        width: `${width}px`,
        transition: 'opacity 1s',
        opacity: +enabled,
      }}
    />
  )
}
