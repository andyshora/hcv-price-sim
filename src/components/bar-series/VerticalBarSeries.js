import React from 'react'

import AbstractSeries from 'react-vis/es/plot/series/abstract-series'
import BarSeries from './BarSeries'

class VerticalBarSeries extends AbstractSeries {
  static getParentConfig(attr) {
    const isDomainAdjustmentNeeded = attr === 'x'
    const zeroBaseValue = attr === 'y'
    return {
      isDomainAdjustmentNeeded,
      zeroBaseValue,
    }
  }

  render() {
    return (
      <BarSeries
        {...this.props}
        linePosAttr="x"
        valuePosAttr="y"
        lineSizeAttr="width"
        valueSizeAttr="height"
      />
    )
  }
}

VerticalBarSeries.displayName = 'VerticalBarSeries'

export default VerticalBarSeries
