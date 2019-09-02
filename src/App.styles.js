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
    'top   side'
    'main     side'
    'bottom bottom';
  grid-template-columns: 1fr 400px;
  grid-template-rows: 140px 0.9fr 80px;
`

const debugBg = css`
  // background: linear-gradient(45deg, hotpink, black);
`

export const LayoutHeader = styled.header`
  grid-area: top;
  min-height: 50px;
  padding: 2rem 1rem 1rem 2rem;
  ${debugBg}
`
export const LayoutSidebar = styled.aside`
  grid-area: side;
  position: relative;
  min-height: 640px;
  display: grid;
  grid-template-columns: 50% 50%;
  margin-right: 0.5rem;

  ${debugBg}
`

export const LayoutDial = styled.div`
  position: absolute;
  width: 200px;
  height: 250px;
  top: 60px;
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
  padding: 0 0 1rem 2rem;
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

export const SimpleGraphWrap = styled.div`
  grid-area: main;
  width: 90%;
  min-height: 500px;
  @media (min-height: 800px) {
    min-height: 600px;
  }
  @media (min-height: 1000px) {
    min-height: 800px;
  }
`

export const GraphWrap = styled.div`
  grid-area: main;
  width: 100%;
  min-height: 500px;
  @media (min-height: 800px) {
    min-height: 600px;
  }
  @media (min-height: 1000px) {
    min-height: 700px;
  }
`

export const BreakdownWrap = styled.aside`
  display: grid;
  grid-area: side;
  grid-template-columns: 50% 50%;
  padding: 50px 0 0 3rem;
`

export const ViewNav = styled.nav`
  display: flex;
  position: relative;
  z-index: 20;
  justify-content: space-between;
  margin: 0 0 2rem 0;
`

export const VerticalCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  > div {
    margin: auto;
  }
`
