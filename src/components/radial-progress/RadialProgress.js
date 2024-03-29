import React from 'react'
import { XYPlot, ArcSeries } from 'react-vis'
import theme from '../../theme'
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'

const { series } = theme.palette

const ChartWrap = styled.div`
  position: relative;
`

const CenterLabel = styled.div`
  position: absolute;
  width: 100%;
  left: 0;
  text-align: center;
  top: 0;
  height: 100%;
  width: 100%;
  color: ${theme.palette.text.primary};
  font-size: 2.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 10px;

  > span {
    font-size: 1rem;
    position: relative;
    left: 2px;
    top: 0.4rem;
    width: 10px;
  }
`

const TitleLabel = styled.div`
  padding: 0;
  text-align: center;

  > h5 {
    margin: 0;
    position: relative;
    top: -20px;
    font-size: 1.8rem;
  }
`

const PlotWrap = styled.div`
  position: relative;
  &::before {
    content: '';
    position: absolute;
    width: 90%;
    height: 90%;
    display: block;
    top: 5%;
    left: 5%;
    border-radius: 50%;
  }
`

function RadialProgress({
  max = 1,
  values,
  colors = series,
  width,
  height,
  suffix = '',
  title = '',
  showShadow = true,
  label = null,
}) {
  const seriesData = []
  let angle0 = 0

  for (let i = 0; i < values.length; i++) {
    const v = values[i]
    const fract = v / max
    const angle = angle0 + Math.PI * 2 * fract
    seriesData.push({
      angle0,
      angle,
      radius: width * 0.4,
      radius0: width * 0.4 - 25,
      color: colors[i],
    })
    angle0 += angle
  }
  return (
    <ChartWrap>
      <PlotWrap>
        <XYPlot width={width} height={height}>
          <ArcSeries
            xDomain={[-5, 5]}
            yDomain={[-5, 5]}
            radiusType={'literal'}
            center={{ x: 0, y: 0 }}
            marginLeft={25}
            marginTop={25}
            data={[
              {
                angle0: 0,
                angle: Math.PI * 2,
                radius: width * 0.4 - 24.5,
                radius0: width * 0.4 - 25,
                color: '#ffffff',
              },
            ]}
            colorType={'literal'}
          />
          <ArcSeries
            xDomain={[-5, 5]}
            yDomain={[-5, 5]}
            radiusType={'literal'}
            center={{ x: 0, y: 0 }}
            marginLeft={25}
            marginTop={25}
            data={seriesData}
            colorType={'literal'}
          />
        </XYPlot>
        <CenterLabel>
          {label || values[0]} {suffix && <span>{suffix}</span>}
        </CenterLabel>
      </PlotWrap>
      {title && (
        <TitleLabel>
          <Typography variant="h5">{title}</Typography>
        </TitleLabel>
      )}
    </ChartWrap>
  )
}

export default RadialProgress
