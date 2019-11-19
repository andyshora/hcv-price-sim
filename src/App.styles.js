import styled, { css } from 'styled-components'

// grid-template-areas:
//     't t'
//     'v c'
//     '. h';

const debugBg = css`
  // background: linear-gradient(45deg, hotpink, black);
`

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
  grid-template-columns: 1fr 320px;
  grid-template-rows: 100px 0.9fr 100px;
`

export const WideLayoutWrap = styled(LayoutWrap)`
  display: grid;
  grid-template-areas:
    'top'
    'main'
    'bottom';
  grid-template-columns: 100%;
  grid-template-rows: 0px 0.9fr 60px;
`

export const Overlay = styled.div`
  position: fixed;
  background: black;
  width: 100%;
  height: 100%;
  z-index: 99;
  top: 0;
  left: 0;
  transition: opacity 1s linear;
  opacity: ${props => (props.show ? 1 : 0)};
  pointer-events: ${props => (props.show ? 'all' : 'none')};
`

export const LayoutHeader = styled.header`
  grid-area: top;
  padding: 3rem 1rem 0 9.5rem;
  user-select: none;
  ${debugBg}
`
export const LayoutSidebar = styled.aside`
  grid-area: side;
  position: relative;
  min-height: 640px;

  margin-right: 0.5rem;

  ${debugBg}
`

export const CostBreakdownWrap = styled.div`
  display: grid;
  grid-template-columns: ${props => (props.columns === 2 ? '50% 50%' : '100%')};
  position: relative;

  ${debugBg}
`

export const LayoutDial = styled.div`
  position: absolute;
  width: 160px;
  height: 300px;
  top: -30px;
  left: -250px;
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
  min-height: 100px;
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
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-left: 2rem;

  > label {
    &:first-child {
      text-align: right;
      opacity: ${props => (props.on ? 0.4 : 1)};
    }
    white-space: nowrap;
    user-select: none;
    cursor: pointer;
    margin: 0 0.5rem;
    font-size: 1.6rem;
    transition: opacity 0.6s;
    opacity: ${props => (props.on ? 1 : 0.4)};
  }
`

export const SpanSVG = styled.svg`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: red;
  z-index: -1;
`

export const SummaryWrap = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  padding: 2rem 4rem 2rem;

  h3 {
  }
`
export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: 0.25fr 0.25fr 0.25fr 0.25fr;
  grid-template-rows: 100px 200px 1fr;
  padding: 1rem 0;
  position: relative;
  height: 100%;
  width: 100%;
  grid-template-areas:
    'h1 h1 h1 h2'
    'p1 p2 p3 p4'
    'c1 c2 c3 c4'
    'f1 f2 f3 f4';

  > div {
    width: 100%;
    min-height: 10px;
    text-align: center;
    ${debugBg}
  }
`
