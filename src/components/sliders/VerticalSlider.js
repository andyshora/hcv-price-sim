import React from 'react'
import styled from 'styled-components'
import Slider from '@material-ui/core/Slider'
import theme from '../../theme'

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
        ${theme.palette.primary.light} 11px,
        #ffffff57 13px,
        rgba(0, 0, 0, 0) 13px
      );
      mix-blend-mode: color;
    }
  }
`

function VerticalThumbComponent(props) {
  return (
    <VerticalThumbWrap {...props}>
      <span />
    </VerticalThumbWrap>
  )
}

export default function VerticalSlider({
  bounds,
  onChange,
  height = 300,
  defaultValue = 1,
  enabled = false,
  max = 100,
  margin = '0',
}) {
  return (
    <Slider
      orientation="vertical"
      valueLabelFormat={v => `$${v}`}
      valueLabelDisplay="auto"
      onChange={onChange}
      min={0.5}
      max={max}
      step={0.5}
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
