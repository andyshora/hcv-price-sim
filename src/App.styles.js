import styled, { css } from 'styled-components'
import { Paper } from '@material-ui/core'

// grid-template-areas:
//     't t'
//     'v c'
//     '. h';

export const LayoutWrap = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-areas:
    'top   top'
    'main   side'
    'bottom bottom';
  grid-template-columns: 1fr 400px;
  grid-template-rows: 120px 0.9fr 60px;
`

const debugBg = css`
  // background: linear-gradient(45deg, hotpink, black);
`

export const LayoutHeader = styled.header`
  grid-area: top;
  padding: 3rem 1rem 0 2rem;
  ${debugBg}
`
export const LayoutSidebar = styled.aside`
  grid-area: side;
  position: relative;
  min-height: 640px;
  display: grid;
  grid-template-columns: ${props => (props.columns === 2 ? '50% 50%' : '100%')};
  margin-right: 0.5rem;

  ${debugBg}
`

export const LayoutDial = styled.div`
  position: absolute;
  width: 200px;
  height: 250px;
  top: 0px;
  left: -220px;
  z-index: 10;

  ${debugBg}
`

export const LayoutMain = styled.div`
  grid-area: main;
  min-height: 50px;
  ${debugBg}
`
export const LayoutFooter = styled.footer`
  grid-area: bottom;
  min-height: 50px;
  ${debugBg}
`

export const LayoutNav = styled.nav`
  padding: 0 0 0 2rem;
  display: flex;
  flex-direction: row;
  align-items: center;
`

export const DynamicChartViewWrap = styled.div`
  ${debugBg}
  width: 100%;
  height: 100%;
  min-height: 300px;
  display: grid;
  grid-template-areas:
    'yaxis  main'
    '.      xaxis';
  grid-template-columns: 100px 1fr;
  grid-template-rows: 1fr 50px;
  overflow: hidden;
`

export const ChartWrap = styled.div`
  grid-area: main;
  min-height: 300px;
  height: 100%;
  background: black;
`

export const PresetsWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  transition: opacity 0.4s ease;
`

export const VerticalControls = styled.div`
  grid-area: yaxis;
  display: flex;
  flex-align: center;
  justify-content: center;
  justify-content: flex-end;
`

export const HorizontalControls = styled.div`
  grid-area: xaxis;
  display: flex;
  flex-direction: row;
  flex-align: center;
  justify-content: flex-end;
  position: relative;
  top: -2.5rem;
`

export const SwitchWrap = styled.div`
  padding: 0 0 0 2rem;
  transition: opacity 1s;
  opacity: ${props => (props.active ? 1 : 0)};
`
