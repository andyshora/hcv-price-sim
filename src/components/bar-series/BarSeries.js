import React from 'react'

import PropTypes from 'prop-types'

import { getStackParams } from 'react-vis/es/utils/series-utils'

import AbstractSeries from 'react-vis/es/plot/series/abstract-series'

const predefinedClassName = 'rv-xy-plot__series rv-xy-plot__series--bar'

class BarSeries extends AbstractSeries {
  static get propTypes() {
    return {
      ...AbstractSeries.propTypes,
      linePosAttr: PropTypes.string,
      valuePosAttr: PropTypes.string,
      lineSizeAttr: PropTypes.string,
      valueSizeAttr: PropTypes.string,
      cluster: PropTypes.string,
    }
  }

  render() {
    const {
      animation,
      className,
      data,
      linePosAttr,
      lineSizeAttr,
      marginLeft,
      marginTop,
      style,
      valuePosAttr,
      valueSizeAttr,
    } = this.props

    if (!data) {
      return null
    }

    const { sameTypeTotal, sameTypeIndex } = getStackParams(this.props)

    const distance = this._getScaleDistance(linePosAttr)
    const lineFunctor = this._getAttributeFunctor(linePosAttr)
    const valueFunctor = this._getAttributeFunctor(valuePosAttr)
    const value0Functor = this._getAttr0Functor(valuePosAttr)
    const fillFunctor =
      this._getAttributeFunctor('fill') || this._getAttributeFunctor('color')
    const strokeFunctor =
      this._getAttributeFunctor('stroke') || this._getAttributeFunctor('color')
    const opacityFunctor = this._getAttributeFunctor('opacity')

    const itemSize = (distance / 2) * 0.3

    return (
      <g
        className={`${predefinedClassName} ${className}`}
        transform={`translate(${marginLeft},${marginTop})`}
      >
        {data.map((d, i) => {
          const attrs = {
            style: {
              opacity: opacityFunctor && opacityFunctor(d),
              stroke: strokeFunctor && strokeFunctor(d),
              fill: fillFunctor && fillFunctor(d),
              ...style,
            },
            [linePosAttr]:
              lineFunctor(d) -
              itemSize +
              ((itemSize * 2) / sameTypeTotal) * sameTypeIndex,
            [lineSizeAttr]: (itemSize * 2) / sameTypeTotal,
            [valuePosAttr]: Math.min(value0Functor(d), valueFunctor(d)),
            [valueSizeAttr]: Math.abs(-value0Functor(d) + valueFunctor(d)),
            onClick: e => this._valueClickHandler(d, e),
            onContextMenu: e => this._valueRightClickHandler(d, e),
            onMouseOver: e => this._valueMouseOverHandler(d, e),
            onMouseOut: e => this._valueMouseOutHandler(d, e),
            key: i,
          }
          return <rect {...attrs} />
        })}
      </g>
    )
  }
}

BarSeries.displayName = 'BarSeries'

export default BarSeries
