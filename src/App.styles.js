import styled from 'styled-components'

// grid-template-areas:
//     't t'
//     'v c'
//     '. h';
export const GridWrap = styled.div`
  width: 100%;
  min-width: 1000px;
  display: grid;
  position: relative;
  margin: 50px auto 0;
  grid-template-areas:
    'top    top     side'
    'yaxis  main    side'
    '.      xaxis   .'
    'bottom bottom  bottom';
  grid-template-columns: 100px 1fr 400px;
  grid-template-rows: 120px 1fr 120px 50px;
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
  right: 0;
`

export const BreakdownWrap = styled.aside`
  // width: 80%;
  // position: absolute;
  right: 0;
  // top: -50px;
  display: grid;
  grid-area: side;
  grid-template-columns: 50% 50%;
  padding: 0 0 0 2rem;

  // @media (min-height: 700px) {
  //   top: 0;
  // }

  // @media (min-width: 1200px) {
  //   width: 70%;
  // }

  // @media (min-width: 1400px) {
  //   width: 60%;
  // }
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
