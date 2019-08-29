import React from 'react'
import { createMuiTheme } from '@material-ui/core/styles'
import chroma from 'chroma-js'
import './fonts/stylesheet.css'

const typography = {
  h1: {
    fontFamily: 'halis_rextralight',
    fontWeight: 'normal',
    fontSize: '4rem',
  },
  h2: {
    fontFamily: 'halis_rextralight',
    fontWeight: 'normal',
    fontSize: '3rem',
  },
  h3: {
    fontFamily: 'halis_rextralight',
    fontWeight: 'normal',
    fontSize: '2.4rem',
  },
  h4: {
    fontFamily: 'halis_rextralight',
    fontWeight: 'normal',
    fontSize: '1.5rem',
    textTransform: 'uppercase',
  },
  h5: {
    fontFamily: 'halis_rextralight',
    fontWeight: 'normal',
    fontSize: '1.5rem',
  },
  fontFamily: 'halis_rextralight',
  fontWeightRegular: 'normal',
}

function generateVizTheme({ base, themeName }) {
  return {
    globalCSS: `
    .rv-treemap {
      font-size: 12px;
      position: relative;
    }
    
    .rv-treemap__leaf {
      overflow: hidden;
      position: absolute;
    }
    
    .rv-treemap__leaf--circle {
      align-items: center;
      border-radius: 100%;
      display: flex;
      justify-content: center;
    }
    
    .rv-treemap__leaf__content {
      overflow: hidden;
      padding: 10px;
      text-overflow: ellipsis;
    }
    
    .rv-xy-plot {
      color: ${base.fgScale(0.76).css()};
      position: relative;
      font-family: "halis_rextralight";
    }
    
    .rv-xy-plot canvas {
      pointer-events: none;
    }
    
    .rv-xy-plot .rv-xy-canvas {
      pointer-events: none;
      position: absolute;
    }
    
    .rv-xy-plot__inner {
      display: block;
    }
    
    .rv-xy-plot__axis__line {
      fill: none;
      stroke-width: 2px;
      stroke: ${base.fgScale(0.1).css()};
    }
    
    .rv-xy-plot__axis__tick__line {
      stroke: ${base.fgScale(0.1).css()};
    }
    
    .rv-xy-plot__axis__tick__text {
      fill: ${base.fgScale(0.42).css()};
      font-size: 20px;
      user-select: none;
    }
    
    .rv-xy-plot__axis__title text {
      fill: ${base.fg};
      font-size: 1.4rem;
      user-select: none;
    }
    
    .rv-xy-plot__axis--vertical .rv-xy-plot__axis__title {
      transform: translateX(0px);
    }
    
    .rv-xy-plot__axis--horizontal .rv-xy-plot__axis__title {
      transform: translateY(80px);
    }
    
    .rv-xy-plot__grid-lines__line {
      stroke: ${base.vizBgScale(0.55).css()};
    }
    
    .rv-xy-plot__circular-grid-lines__line {
      fill-opacity: 0;
      stroke: ${base.vizBgScale(0.1).css()};
    }
    
    .rv-xy-plot__series,
    .rv-xy-plot__series path {
      pointer-events: all;
    }
    
    .rv-xy-plot__circular-grid-lines__line {
      fill-opacity: 0;
      stroke: ${base.fgScale(0.1).css()};
    }
    
    .rv-xy-plot__series,
    .rv-xy-plot__series path {
      pointer-events: all;
    }
    
    .rv-xy-plot__series--line {
      fill: none;
      stroke: ${base.fg};
      stroke-width: 2px;
    }
    
    .rv-crosshair {
      position: absolute;
      font-size: 11px;
      pointer-events: none;
    }
    
    .rv-crosshair__line {
      background: #47d3d9;
      width: 1px;
    }
    
    .rv-crosshair__inner {
      position: absolute;
      text-align: left;
      top: 0;
    }
    
    .rv-crosshair__inner__content {
      border-radius: 4px;
      background: ${base.fgScale(0.22).css()};
      color: ${base.bg};
      font-size: 12px;
      padding: 7px 10px;
      box-shadow: 0 2px 4px ${chroma(base.fg)
        .alpha(0.5)
        .css()};
    }
    
    .rv-crosshair__inner--left {
      right: 4px;
    }
    
    .rv-crosshair__inner--right {
      left: 4px;
    }
    
    .rv-crosshair__title {
      font-weight: bold;
      white-space: nowrap;
    }
    
    .rv-crosshair__item {
      white-space: nowrap;
    }
    
    .rv-hint {
      position: absolute;
      pointer-events: none;
    }
    
    .rv-hint__content {
      border-radius: 4px;
      padding: 7px 10px;
      font-size: 12px;
      background: ${base.fgScale(0.22).css()};
      box-shadow: 0 2px 4px ${chroma(base.fg)
        .alpha(0.5)
        .css()};
      color: ${base.bg};
      text-align: left;
      white-space: nowrap;
    }
    
    .rv-discrete-color-legend {
      box-sizing: border-box;
      overflow-y: auto;
      font-size: 12px;
      position: absolute;
      padding: 1rem;
      top: 1rem;
      right: 1rem;
      user-select: none;
      border: 1px solid ${base.vizBgScale(0.55).css()};
      background: ${chroma(base.bg)
        .alpha(0.8)
        .css()};
    }
    
    .rv-discrete-color-legend.horizontal {
      white-space: nowrap;
    }
    
    .rv-discrete-color-legend-item {
      color: ${base.bg};
      border-radius: 1px;
      padding: 9px 10px;
    }
    
    .rv-discrete-color-legend-item.horizontal {
      display: inline-block;
    }
    
    .rv-discrete-color-legend-item.horizontal
      .rv-discrete-color-legend-item__title {
      margin-left: 0;
      display: block;
    }
    
    .rv-discrete-color-legend-item__color {
      background: ${base.fgScale(0.86).css()};
      display: inline-block;
      height: 4px;
      vertical-align: middle;
      width: 14px;
    }
    
    .rv-discrete-color-legend-item__title {
      margin-left: 10px;
    }
    
    .rv-discrete-color-legend-item.disabled {
      color: ${base.fgScale(0.72).css()};
    }
    
    .rv-discrete-color-legend-item.clickable {
      cursor: pointer;
    }
    
    .rv-discrete-color-legend-item.clickable:hover {
      background: ${base.bg};
    }
    
    .rv-search-wrapper {
      display: flex;
      flex-direction: column;
    }
    
    .rv-search-wrapper__form {
      flex: 0;
    }
    
    .rv-search-wrapper__form__input {
      width: 100%;
      color: ${base.fgScale(0.65).css()};
      border: 1px solid ${base.fgScale(0.9).css()};
      padding: 7px 10px;
      font-size: 12px;
      box-sizing: border-box;
      border-radius: 2px;
      margin: 0 0 9px;
      outline: 0;
    }
    
    .rv-search-wrapper__contents {
      flex: 1;
      overflow: auto;
    }
    
    .rv-continuous-color-legend {
      font-size: 12px;
    }
    
    .rv-continuous-color-legend .rv-gradient {
      height: 4px;
      border-radius: 2px;
      margin-bottom: 5px;
    }
    
    .rv-continuous-size-legend {
      font-size: 12px;
    }
    
    .rv-continuous-size-legend .rv-bubbles {
      text-align: justify;
      overflow: hidden;
      margin-bottom: 5px;
      width: 100%;
    }
    
    .rv-continuous-size-legend .rv-bubble {
      background: ${base.fgScale(0.85).css()};
      display: inline-block;
      vertical-align: bottom;
    }
    
    .rv-continuous-size-legend .rv-spacer {
      display: inline-block;
      font-size: 0;
      line-height: 0;
      width: 100%;
    }
    
    .rv-legend-titles {
      height: 16px;
      position: relative;
    }
    
    .rv-legend-titles__left,
    .rv-legend-titles__right,
    .rv-legend-titles__center {
      position: absolute;
      white-space: nowrap;
      overflow: hidden;
    }
    
    .rv-legend-titles__center {
      display: block;
      text-align: center;
      width: 100%;
    }
    
    .rv-legend-titles__right {
      right: 0;
    }
    
    .rv-radial-chart .rv-xy-plot__series--label {
      pointer-events: none;
    }
    .rv-discrete-color-legend-item__title { color: ${base.fg} }
    .rv-discrete-color-legend-item {
      padding: 0.2rem 0.5rem;
  }
    `,
    themeName,
    XYPlot: {
      margin: 60,
    },
    XAxis: {
      orientation: 'bottom',
      position: 'middle',
      tickSizeInner: 1,
      tickSizeOuter: 5,
      style: { fill: base.fg },
    },
    YAxis: {
      orientation: 'left',
      position: 'middle',
      tickSizeInner: 1,
      tickSizeOuter: 5,
      style: { fill: base.fg },
    },
    MarkSeries: {
      size: 4,
    },
    MarkSeriesStyle: {
      fillOpacity: 0.2,
      strokeWidth: 1,
    },
    SVG: {
      patterns: {
        createStripePattern: ({
          fill = colorScales.primary(1),
          id = 'stripes',
          textureOpacity = 0.5,
          fillOpacity = 1,
        }) => (
          <pattern id={id} patternUnits="userSpaceOnUse" width="5" height="5">
            <rect width="5" height="5" x="0" y="0" fill={fill} />
            <image
              opacity={0.5}
              xlinkHref="data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc1JyBoZWlnaHQ9JzUnPgogIDxyZWN0IHdpZHRoPSc1JyBoZWlnaHQ9JzUnIGZpbGw9J3doaXRlJy8+CiAgPHBhdGggZD0nTTAgNUw1IDBaTTYgNEw0IDZaTS0xIDFMMSAtMVonIHN0cm9rZT0nIzg4OCcgc3Ryb2tlLXdpZHRoPScxJy8+Cjwvc3ZnPg=="
              x="0"
              y="0"
              width="5"
              height="5"
            />
          </pattern>
        ),
      },
    },
  }
}

function lightDark(options, themeName) {
  return themeName === 'Gamma Light' ? options[0] : options[1]
}

function generateUITheme({ base, themeName, type }) {
  return createMuiTheme({
    spacing: 8,
    props: {
      MuiAppBar: {
        color: 'default',
      },
    },
    overrides: {
      MuiFilledInput: {
        root: {
          backgroundColor: chroma(base.fg)
            .alpha(0.02)
            .css(),
          borderRadius: 0,
          boxShadow: `inset 0 0 10px ${chroma(base.bg)
            .alpha(0.5)
            .css()}`,
        },
        underline: {
          '&:before': {
            borderBottomColor: colorScales.primary(0).css(),
          },
        },
      },
      MuiAvatar: {
        root: {
          borderRadius: 0,
        },
      },
      MuiChip: {
        root: {
          borderRadius: 0,
        },
        avatar: {
          '$-outlined &': {
            marginLeft: 0,
          },
        },
      },
      MuiInput: {
        root: {
          backgroundColor: `${lightDark(
            [
              base.bg,
              chroma(base.fg)
                .alpha(0.02)
                .css(),
            ],
            themeName
          )}`,
          borderRadius: 0,
          boxShadow: `inset 0 0 10px ${chroma(base.bg)
            .alpha(0.5)
            .css()}`,
        },
        underline: {
          '&:before': {
            borderBottomColor: colorScales.primary(0).css(),
          },
        },
      },
      MuiInputLabel: {
        root: {
          color: base.fgScale(0.26).css(),
          zIndex: 1,
        },
      },
      MuiPaper: {
        root: {
          background: `
          radial-gradient(circle at top, ${base
            .bgScale(0.33)
            .css()}, transparent),
          radial-gradient(circle at bottom, ${base
            .bgScale(0.22)
            .css()}, transparent)`,
          border: `1px solid ${chroma(base.fg)
            .alpha(0.15)
            .css()}`,
          borderImage: `
          linear-gradient(0deg, ${base.bgScale(0.22).css()}, ${base
            .bgScale(0.44)
            .css()}, ${base.bgScale(0.66).css()}) 1`,
        },
      },
      MuiExpansionPanelDetails: {
        root: {
          backgroundImage: `linear-gradient(180deg, ${
            baseColors.bg
          } 0%, ${base.bgScale(0.08).css()} 20px)`,
          boxShadow: `inset 0 0 5px ${chroma(base.bg)
            .alpha(0.9)
            .css()}`,
          padding: 24,
        },
      },
      MuiSnackbarContent: {
        root: {
          backgroundImage: 'none',
        },
      },
      MuiButton: {
        contained: {
          backgroundColor: 'rgb(255, 255, 255)',
        },
      },
      MuiToggleButton: {
        root: {
          '&.Mui-selected': {
            boxShadow: `inset 0 0 4px rgba(0, 0, 0, 0.1)`,
          },
        },
      },
      MuiListItemIcon: {
        root: {
          minWidth: 32,
        },
      },
    },
    shape: {
      borderRadius: 0,
    },
    palette: {
      base,
      background: {
        default: base.bgScale(0.22).css(),
        paper: base.bgScale(0.22).css(),
      },
      type,
      text: {
        primary: base.fg,
      },
      primary: {
        main: colorScales.primary(0.5).css(),
        dark: colorScales.primary(0).css(),
        light: colorScales.primary(1).css(),
      },
      secondary: {
        main: colorScales.secondary(0.5).css(),
        dark: colorScales.secondary(0).css(),
        light: colorScales.secondary(1).css(),
      },
      series: [
        '#32c77f',
        '#f9d129',
        '#6c9bdc',
        '#fd4343',
        '#dcf6df',
        '#30C1D7',
      ],
      seriesQ: chroma.scale('PuRd').colors(3),
    },
    typography,
    themeName,
  })
}

// https://material.io/resources/color/#!/?view.left=0&view.right=1&primary.color=43fda2&secondary.color=4B3A40
// https://react-theming.github.io/create-mui-theme/

export const colorScales = {
  primary: chroma.scale(['rgb(17,63,41)', 'rgb(67,253,162)']),
  secondary: chroma.scale(['#670F31', '#E71C57']),
  blues: chroma.scale(['#295E7E', '#30C1D7']),
  pinks: chroma.scale(['#670F31', '#E71C57']),
  greens: chroma.scale(['#197A56', '#29BA74']),
  helix: chroma.cubehelix().lightness([0.3, 0.7]),
  brewer1: chroma.scale('RdBu'),
  temperature: chroma.scale(['#E71C57', '#ff0', 'rgb(67,253,162)']),
  jmi: ['#c41300', '#f56324', '#f5ac24', '#ffff00'],
}

const baseColors = {
  dark: {
    bg: 'rgb(0, 0, 0)',
    bgScale: chroma.scale(['rgb(0, 0, 0)', 'rgb(100, 100, 100)']),
    vizBgScale: chroma.scale(['rgb(0, 0, 0)', 'rgb(100, 100, 100)']),
    fg: 'rgb(255, 255, 255)',
    fgScale: chroma.scale(['rgb(255, 255, 255)', 'rgb(0, 0, 0)']),
  },
  light: {
    bg: 'rgb(255, 255, 255)',
    bgScale: chroma.scale(['rgb(255, 255, 255)', 'rgb(255, 255, 255)']),
    vizBgScale: chroma.scale(['rgb(255, 255, 255)', 'rgb(155, 155, 155)']),
    fg: 'rgb(11, 11, 11)',
    fgScale: chroma.scale(['rgb(0, 0, 0)', 'rgb(255, 255, 255)']),
  },
}

export const themes = {
  ui: {
    light: generateUITheme({
      base: baseColors.light,
      themeName: 'Gamma Light',
      type: 'light',
    }),
    dark: generateUITheme({
      base: baseColors.dark,
      themeName: 'Gamma Dark',
      type: 'dark',
    }),
  },
  viz: {
    light: generateVizTheme({
      base: baseColors.light,
      themeName: 'Gamma Light',
      type: 'light',
    }),
    dark: generateVizTheme({
      base: baseColors.dark,
      themeName: 'Gamma Dark',
      type: 'dark',
    }),
  },
}

export const reactVizTheme = themes.viz.dark
export default themes.ui.dark
