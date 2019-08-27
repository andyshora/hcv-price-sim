import styled from 'styled-components'

export const GridWrap = styled.div`
  width: 100%;
  display: grid;
  position: relative;
  margin: 50px auto 0;
  grid-template-areas:
    't t'
    'v c'
    '. h';
  grid-template-rows: 120px 1fr 50px;
  grid-template-columns: 70px 1fr;
  overflow: hidden;
`
export const PresetsWrap = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  display: flex;
  justify-content: flex-end;
`
export const Header = styled.div`
  grid-area: t;
  display: grid;
  grid-template-columns: 1fr;
`
export const VerticalControls = styled.div`
  grid-area: v;
  display: flex;
  flex-align: center;
  justify-content: center;
  justify-content: flex-end;
`
export const HorizontalControls = styled.div`
  grid-area: h;
  display: flex;
  flex-direction: row;
  flex-align: center;
  justify-content: flex-end;
`

export const GraphWrap = styled.div`
  grid-area: c;
  width: 100%;
  min-height: 600px;
  @media (max-height: 800px) {
    min-height: 500px;
  }
`

export const BreakdownWrap = styled.div`
  width: 50%;
  height: 450px;
  position: absolute;
  right: 0;
  top: -50px;
  display: grid;
  grid-template-columns: 160px 160px 1fr;

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
  }
`

export const ViewNav = styled.nav`
  display: flex;
  position: relative;
  z-index: 20;
  justify-content: space-between;
`
