import styled from 'styled-components'
import { Paper } from '@material-ui/core'

// grid-template-areas:
//     't t'
//     'v c'
//     '. h';

export const GridWrap = styled.div`
  width: 100%;
  min-width: 1000px;
  display: grid;
  position: relative;
  margin: 0 auto;
  grid-template-areas:
    'top    top     side'
    'yaxis  main    side'
    '.      xaxis   .'
    'bottom bottom  bottom';
  grid-template-columns: 100px 1fr 450px;
  grid-template-rows: 120px 1fr 120px 50px;
  overflow: hidden;
`

export const SimpleGridWrap = styled(GridWrap)`
  width: 100%;
  min-width: 1000px;
  display: grid;
  position: relative;
  margin: 0 auto;
  grid-template-areas:
    'top    top'
    'yaxis  main'
    '.      xaxis'
    'bottom bottom  bottom';
  grid-template-columns: 100px 1fr;
  grid-template-rows: 120px 1fr 120px;
  overflow: hidden;
`

export const PresetsWrap = styled.div`
  position: fixed;
  right: 1rem;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  transition: opacity 0.4s ease;
  opacity: 0.2;
  &:hover {
    opacity: 1;
  }
`
export const Header = styled.div`
  grid-area: top;
  display: grid;
  grid-template-columns: 1fr;
  padding-top: 50px;
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
  width: 100%;
  min-height: 500px;
  @media (min-height: 800px) {
    min-height: 700px;
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

export const CuredWrap = styled.div`
  position: absolute;
  top: 0;
  right: 2rem;
`

export const BreakdownWrap = styled(Paper)`
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
`

export const VerticalCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  > div {
    margin: auto;
  }
`
