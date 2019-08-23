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
  grid-template-columns: 50px 1fr;
`
export const Header = styled.div`
  grid-area: t;
`
export const VerticalControls = styled.div`
  grid-area: v;
  display: flex;
  flex-align: center;
  justify-content: center;
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
`

export const BreakdownWrap = styled.div`
  width: 50%;
  height: 400px;
  position: absolute;
  right: 0;
  top: 0;
`

export const ViewNav = styled.nav`
  position: relative;
  z-index: 20;
`

export const LineLabel = styled.label`
text-align: center;
display: flex;
flex-direction: row;
align-items: baseline;
text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);

> label {
  font-size: 1.2rem;
  text-transform: uppercase;
  margin: 0 5px;
  text-align: center;
  white-space: nowrap;
}
> div {
  font-size: 3rem;
  margin: 0;
  text-align: center;
  &::before {
    content: '${props => props.prefix || ''}';
    opacity: 0.2;
    position: relative;
    left: -18px;
  }
}
`
