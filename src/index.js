import React from 'react'
import ReactDOM from 'react-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/styles'
import { createGlobalStyle } from 'styled-components'

import App from './App'
import theme, { reactVizTheme } from './theme'
import './fonts/stylesheet.css'

const GlobalVizStyles = createGlobalStyle`${reactVizTheme.globalCSS}`

ReactDOM.render(
  <ThemeProvider theme={theme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    <GlobalVizStyles />
    <App />
  </ThemeProvider>,
  document.querySelector('#root')
)
